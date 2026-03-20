# Capítulo 11 — Quiz

Agora uma questão capciosa muito explorada em entrevistas:

```js
[] == ![]; // true
```

### Explicação

Como isso é possível?
Vamos avaliar o passo a passo da coerção que o motor da linguagem faz por debaixo dos panos:

1. O operador de negação `!` avalia o valor à sua direita. O Array vazio `[]` é um Objeto, e como vimos antes, todo objeto é *Truthy*. Portanto, a negação inverte-o para o booleano estrito `false`.
2. A operação se torna: `[] == false`.
3. Ao usar a igualdade frouxa `==` entre um Objeto e um Booleano, o JS força o booleano a virar número (`false` vira `0`). Temos agora: `[] == 0`.
4. Em seguida, ele obriga o Array `[]` a se converter para um primitivo invocando o método `.toString()`, o que transforma a lista vazia em uma string vazia `""`. Temos: `"" == 0`.
5. Por fim, ao comparar string numérica com número numérico, ele converte a string nula `""` para número explícito, o que resulta em `0`.
6. Conclusão da etapa final visível para a CPU matricial: `0 == 0`.

Portanto, o resultado inusitado é exatamente `true`!

---

### Pergunta 2: O famigerado typeof nulo

Outra clássica para testar os fundamentos históricos da linguagem:

```js
typeof null; // "object"
```

**Explicação:**
Este é um dos bugs mais antigos e famosos do JavaScript, presente desde o seu nascimento. O criador (Brendan Eich) teve apenas 10 dias para entregar a primeira versão da linguagem. Nela, as variáveis eram representadas na memória por uma _type tag_ (código de tipo 0 para objetos) e o valor nativo. Porém, o ponteiro nulo (\`null\` do C) é representado apenas por vários zeros na memória da máquina. Como a tag iniciou com 0, o motor inferiu cegamente que \`null\` se tratava do tipo objeto. 
Apesar de ser um erro reconhecido e debatido pelas comissões, hoje em dia ele já não pode mais ser corrigido porque literalmente "quebraria a internet", desestabilizando a retrocompatibilidade com milhões de sites que dependem desse comportamento bizarro para funcionar.

---

### Pergunta 3: A Soma de Listas

O que acontece quando você tenta somar dois Arrays?

```js
[1, 2, 3] + [4, 5, 6]; // "1,2,34,5,6"
```

**Explicação:**
No JavaScript, o operador `+` é estritamente bivalente: ele só sabe fazer soma de números OR concatenação de Strings. 
Como você passou a referência de dois Objetos (Arrays não são primitivos numéricos), o motor entra em estado de pânico e tenta convertê-los para *primitivos*, invocando o método embutido `.toString()`. O toString de um array exibe os seus itens separados pela vírgula.
Logo, a operação sofre a seguinte mutação:
`"1,2,3" + "4,5,6"`.
E voilà! Uma simples concatenação emendada de Strings perfeitamente ilógica para olhares humanos.

---

### Pergunta 4: A Matemática Invertida

Compare este comportamento envolvendo a busca pelo maior contra a busca pelo menor:

```js
Math.max() > Math.min(); // false
```

**Explicação:**
Como a função `Math.max()` encontra o maior número de uma lista de argumentos se você passar um array vazio ou não fornecer argumentos? Ela começa a comparação no seu limite inicial negativo abstrato. O valor inicial por baixo dos panos de um Max genérico é o `-Infinity`.
Da mesma forma, o ponto de partida do `Math.min()` quando iterado no vazio é o `Infinity`.
A comparação real que a linguagem está sendo forçada a resolver pela ausência de parâmetros é:
`-Infinity > Infinity`. O que, matematicamente, reflete exatamente um belo e absoluto `false`!
