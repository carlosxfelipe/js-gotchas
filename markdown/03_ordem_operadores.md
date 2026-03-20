# Capítulo 3 — Ordem dos Operadores (Precedência)

A precedência de operadores determina a ordem na qual o JavaScript avalia e resolve diferentes partes de uma única expressāo. Assim como na matemática básica (onde a multiplicação é feita antes da soma), o JavaScript possui uma tabela interna gigante sobre qual operador "ganha" na fila de execução.

Quando não há o uso explícito de parênteses `()` para isolarmos as intenções matemáticas humanas, armadilhas severas podem surgir.

### O Caso Clássico do `typeof`

O perigo da precedência afeta até os identificadores de tipos nativos. Veja este exemplo:

```js
typeof 1 + 1; // "number1"
```

Instintivamente, esperamos que a operação `1 + 1` rode primeiro para então lermos o tipo do resultado final (`2`), mas o operador lógico `typeof` possui uma precedência maior do que o operador puramente matemático de soma `+`.

Logo, o interpretador resolve da seguinte maneira:

1. `typeof 1` vira a string de texto `"number"`.
2. A operação passa a ser a soma `"number" + 1`.
3. Resultado da concatenação (como vimos no capítulo 1): `"number1"`.

Para obter a resposta da soma antes da análise de tipo, deve-se aplicar o parêntesis como barreira de precedência máxima garantida: `typeof (1 + 1)` resulta `"number"`.

### A Pegadinha Destrutiva do Operador Ternário (`? :`)

O operador ternário é elegante e vastamente utilizado, mas esconde a falha de precedência mais detestada de toda a linguagem! Operadores literais (como a soma `+`) resolvem **antes** da condição do operador ternário.

Se um desenvolvedor for montar uma visualização no log e escrever isso:

```js
const admin = true;
console.log("Usuário é: " + admin ? "Administrador" : "Visitante");
```

**Resultado surpresa:** Ele vai imprimir apenas a palavra **"Administrador"** e a parte inicial da nossa frase ("Usuário é: ") desaparece!

Isso ocorre pois a concatenação com o `+` tem uma precedência gigantesca em relação ao interrogatório lógico do `?` ternário. Como a máquina leu:

1. Ela tentou avaliar: `"Usuário é: " + admin`.
2. O resultado foi a string textual `"Usuário é: true"`.
3. Esta nova string final, por não ser vazia, equivale a um valor booleano **verdadeiro** (Truthy).
4. O interpretador então leu: `("Usuário é: true") ? "Administrador" : "Visitante"`.
5. Retornou apenas a primeira porta, isolando e esquecendo completamente o pedaço da variável originária!

Qual a lição e conserto definitivo para o cenário acima? Sempre encerre seus ternários com os poderosos parênteses na formatação!

```js
console.log("Usuário é: " + (admin ? "Administrador" : "Visitante"));
```

### `&&` sempre vence do `||`

Nas condições booleanas com curto-circuito, o "AND" (`&&`) sempre avalia e agrupa blocos antes do "OR" (`||`).

```js
true || (false && false); // Resultado é true!
```

Por que não foi executado da esquerda para a direita?
Ao analisar o "E", ele transformou seu bloco da ponta (`false && false`) num pacote único avaliado como falso. Logo, o resultado global sobrou como a junção de `true || (false)`, onde a porta "OR" satisfez as exigências graças ao `true` inicial no primeiro bloco!

### Avaliações Interligadas: A Assombração do Right-to-Left

Muitos não percebem, mas o operador de atribuição direta embutido de igual escalar (`=`) analisa a fileira e repassa os valores empacotados partindo da Direita e preenchendo as caixas seguidas da Esquerda!

```js
let a, b, c;
a = b = c = 10;
```

A máquina repassa os escopos nessa ordem invisível: `a = (b = (c = 10))`.
Isso gera problemas caso você passe acidentalmente referências puras (explicadas mais tarde nos capítulos de Array e Objetos), porque todos os valores à esquerda herdarão integralmente o mesmo fragmento físico apontado pelo ponteiro originário que morava na ponta direita!
