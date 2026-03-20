# Capítulo 10 — O Perigo Moderno das Arrow Functions

A _Arrow Function_ (`=>`) foi anunciada no ECMAScript 6, e varreu a internet virando a queridinha dos desenvolvedores por ser absurdamente compacta. Nós a amamos.

> **Curiosidade Histórica:** A sintaxe de "flecha" não foi uma invenção original do comitê do ECMAScript. Ela foi fortemente inspirada (para não dizer copiada) do **CoffeeScript**, uma linguagem criada em 2009 que compilava para JavaScript. No CoffeeScript, já existia a tão aclamada separação entre a "thin arrow" `->` (com o contexto dinâmico) e a "fat arrow" `=>` (que congelava intimamente o escopo léxico do `this`). O sucesso absoluto e o clamor da comunidade pela "fat arrow" do CoffeeScript foi o estopim para que ela fosse adotada e eternizada nativamente no JavaScript Moderno (ES6) em 2015!

Mas muitos a tratam como um simples preenchedor visual e atalho para a clássica `function(){}`. Isso é um erro terrível! Elas têm limitações drásticas sob o capô. A seguir, as 4 grandes pegadinhas ou restrições que farão seu projeto quebrar se você tratá-la apenas "como uma função comum encurtada":

### 1. A Pegadinha do Retorno Implícito de Objeto

O grande charme das _Arrow Functions_ de uma linha é omitir o bloco de instrução `{ }` e a palavra `return`, permitindo o "Retorno Implícito":

```js
const dobrar = (x) => x * 2;
console.log(dobrar(5)); // 10
```

Qual o desastre iminente aqui? O que acontece se seu cliente pedir para voltar de forma rápida não um número, mas a estrutura de um Objeto recém-criado em chaves?

```js
const criarPessoa = (nome) => {
  user: nome;
}; // BUG!
console.log(criarPessoa("Carlos")); // Causa: undefined!
```

O JS surta nessa leitura rápida! Ao enxergar que você usou chaves `{` de cara, a máquina deduz que você está abrindo o "Bloco de Escopo da Função Larga", ela acha que `user:` é apenas um _Label_ da linguagem e encerra sem encontrar seu `return` (retornando silenciosamente `undefined`).

**A Regra do Retorno Imparável:** Se quiser cuspir instintivamente um Objeto em uma arrow function de retorno implícito, você DEVE engolir o esqueleto em parênteses `( )` para provar à sintaxe que se trata da sua resposta final:

```js
const criarPessoa = (nome) => ({ user: nome }); // Parênteses blindado!
console.log(criarPessoa("Carlos")); // { user: "Carlos" }
```

### 2. A Ilusão do `This` (Comportamento Léxico vs Dinâmico)

O recurso número um que separa a _Arrow Function_ de sua mãe `function`! No mundo antigo, quem executava ou "chamava" a função assumia a identidade dela, tornando a propriedade interna `this` mutável e amarrada em tempo de **execução** (Dinâmica).

As _Arrow functions_ odeiam esse comportamento maluco. Elas adotaram o **`this` léxico**. Ou seja: elas varrem e engolem brutalmente a identidade do `this` ambiente pai de fora na hora exata em que você digitou elas no arquivo (na fase de compilação pura e estática), e NUNCA mais soltam aquele ponteiro, por mais que outra classe diferente pegue a função e mande rodar em outro canto do globo.

Se você utilizar isso para métodos de botões (EventListeners) em objetos nativos esperando que o `this` mire na propriedade do próprio botão onde você registrou ou clicou... O `this` será disparado olhando para a raiz gigantesca da janela Inteira `window` ou o escopo base global e não irá achar a sua classe nunca, estourando bugs por toda a arquitetura da UI!

### 3. Falsa Criação: Elas não têm o construtor `new`

Jamais utilize Arrow Functions para instanciar blocos de Fábrica em seus domínios OOP:

```js
const Caminhao = (marca) => {
  this.marca = marca;
};

const volvo = new Caminhao("Volvo"); // TypeError: Caminhao is not a constructor
```

As Arrow Functions foram podadas internamente pelas especificações e não herdam de nenhuma espécie de propriedades internas como os métodos `[[Construct]]` e `.prototype`, poupando peso de arquivo. Essa é a essência delas serem enxutas limitantes: é absolutamente ilegal lançar e construir classes com instâncias delas!

### 4. A Cadeira Vazia dos `arguments`

A velha e boa palavra reservada (o arranjo implícito global "Arguments") de resgate genérico dentro de hierarquias de rotinas foi podada e expurgada delas também. Se precisarmos engolir N parâmetros com dinamismo desconhecidos enviados de fora:

```js
const rastrearVelha = function () {
  console.log(arguments);
};
const rastrearNova = () => {
  console.log(arguments);
};

rastrearVelha(1, 2, 3); // Imprime o protoarray: [1, 2, 3]
rastrearNova(1, 2, 3); // Estoura fatalmente em ReferenceError: arguments is not defined
```

Se quiser recriar o resgate oculto dentro do escopo fechado das flechas com precisão e controle modernos, somos obrigados ao invés disso aplicar e acolher na matriz visual inicial usando o famoso e salvador Espalhamento Rest `(...args) =>` !
