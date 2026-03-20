# Capítulo 4 — Truthy e Falsy e o Curto-Circuito

Para manter a fluidez de execução com a mínima tipagem possível, o interpretador do JavaScript divide arbitrariamente todo e qualquer fragmento de dado do universo em duas panelas distintas quando submetidos a um teste condicional (um `if`, um `while`, ou testes `&&`/`||`): a panela do "Truthy" e a panela do "Falsy".

Não importa se o dado é um booleano (`true` ou `false`) ou não. A regra será sempre aplicada de imediato perante a ausência ou presença do valor.

### A Panela "Falsy" (Lista Fechada)

Existem muito poucos valores que a linguagem considera estruturalmente fracos o bastante para barrar um `if()`. São especificamente estes (e só estes):

- `false` (O óbvio)
- `0` (O zero numérico)
- `-0` (O zero numérico negativo)
- `0n` (O zero do formato pesado BigInt)
- `""` ou `''` ou ` `` ` (Strings absolutamente vazias, sem nem um espaço)
- `null` (A ausência apontada intencionalmente pelo programador)
- `undefined` (A ausência criada e apontada de nascença pelo motor)
- `NaN` (O Not-a-Number, proveniente de um erro matemático)

Um caso histórico raríssimo e bizarro é o `document.all` nos navegadores. Ele não recai sobre essas especificações fundamentais mas é considerado Falsy propositalmente devido à compatibilidade histórica com as décadas de 90.

Fora essa curiosidade arcaica, se o seu valor testado estiver na lista acima, ele é "Falsy" e renderá falso em qualquer teste de validação implícita.

### A Panela "Truthy" (O Resto do Universo)

Se o componente que você testou não está literalmente na lista fechada descrita acima, ele rodará livremente sua condição dando um sinal condicional Verde!

A pegadinha mortal que derruba inúmeros desenvolvedores começa aqui. Arrays e Objetos não estão naquela lista!

```js
if ([]) console.log("rodou"); // Vai imprimir "rodou"!
if ({}) console.log("rodou"); // Vai imprimir "rodou"!
```

"Mas Carlos", muita gente indaga, "a lista está vazia, por que é verdadeiro?".
Porque em JavaScript matrizes e objetos carregam um Registro de Memória. A existência do registro (o "envelopamento" no sistema), ainda que sem itens preenchidos dentro, atesta que _algo_ foi instanciado com sucesso. Como instâncias não estão na lista Falsy restrita, Arrays e Objetos são sempre, **inevitavelmente**, Truthy.

Se você deseja avaliar com segurança se uma matriz ou estrutura está vazia, tem de mirar na propriedade numérica primária do tamanho dela (que aí sim, resultará em `0`, sendo cortada pela lista de Falsy padrão!):

```js
const cesta = [];

if (cesta.length) {
  // O ".length" extrai 0. O If barra!
  // Não vai rodar, salvando sua execução
}
```

### O Desastre no Curto-Circuito (React.js e Operadores Antigos)

Por muitos anos, nós nos apoiávamos nos comportamentos Truthy e Falsy para ditar regras de retornos de valores usando o encadeamento "OU" (`||`).

```js
let nomeDigitado = "";
let exibicao = nomeDigitado || "Visitante Desconhecido";

// A variável exibicao ganha "Visitante Desconhecido"
// porque a string vazia é Falsy e a máquina pulou para a aprovação posterior.
```

O pesadelo começa quando um número `0` era, de fato, a intenção intencional de um usuário num carrinho de compras (Ex: Adicionar 0 itens da Promoção Especial). Por ser `0` e "Falsy", sistemas rejeitavam a escolha válida do zero e injetavam falsos positivos vindos do atalho do `||`.

O mesmo acontece no _React.js_, em que renderizar `quantidade && <MeuComponente/>` sendo a quantidade avaliada igual a `0`, joga na tela visual do seu cliente o número zero solto, em lugar de esconder o componente, porque o JS engole o Curto Circuito validando a ponta inicial.

Para sanar inteiramente esse cenário, a linguagem inseriu há poucos anos o incrivelmente poderoso **Operador de Coalescência Nula (`??`)**. Ele ignora solenemente booleanos, strings vazias e o problemático zero! Ele **só** pula de lado e aplica curto-circuito se você providenciar exatamente `null` ou `undefined`.

```js
let estoque = 0;
let mostrar = estoque || 10; // (Antigo): Erro! Acabou mostrando 10 ignorando o zero!
let moderno = estoque ?? 10; // (Novo) Sucesso! Ele devolve 0 e respeita o valor matemático.
```
