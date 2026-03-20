# Capítulo 5 — Not-A-Number (NaN)

Se `NaN` traduz-se literalmente do inglês como "Não-é-um-Número", você já pode esperar os comportamentos mais exóticos e paradoxais possíveis da linguagem ao lidar com ele.

A matemática tem limites (inclusive dentro das linguagens de programação). O `NaN` foi o componente criado para suportar as frentes de erro de execução sempre que você tenta forçar o interpretador a realizar cálculos que não fazem nenhum sentido no mundo real.

### O Paradoxo do Tipo: É um Número!

Qual você acha que é a tipagem de um valor especial criado com o único intuito de gritar que **não é** um número ("Not A Number")?

```js
typeof NaN; // "number"
```

Sim, a tipagem oficial do `NaN` é `"number"` (Número). Isso acontece porque estruturalmente ele ainda pertence à família matemática dentro da arquitetura da linguagem e dos padrões IEEE 754. Ele é um valor numérico... que atesta uma impossibilidade de representação numérica!

### Uma Ilha Intocável: Não Se Compara `NaN`!

Como eu poderia garantir ou provar que dois resultados corrompidos "não-um-número" são iguais entre si? Em JavaScript, a especificação decidiu que você não pode:

```js
NaN === NaN; // false
```

Todo e qualquer cálculo impossível resulta o estado `NaN`.
Se submetêssemos as resoluções `10 / "A"` e `Number("Maçã")`, ambas dariam `NaN`. No fundo, as falhas são oriundas de causas diferentes. A linguagem avalia que é falso e impreciso comparar entidades comutativas incorretas: duas lógicas com erro nunca serão equivalentes de fato. Por fim, matematicamente, o `NaN` é o único primitivo absoluto de toda a história do JavaScript que não é igual a ele mesmo.

### Como Identificar um Valor `NaN`? E qual o jeito Moderno?

Se eu não posso rastreá-lo testando a variável (`if (resultado === NaN)`), como checar com segurança em sistemas reais para prevenir a UI de mostrar um cálculo quebrado na tela do cliente?

Há duas abordagens na linguagem para validar o Not-A-Number. Porém, quase todo iniciante utiliza a primeira (e problemática!) versão global, herdada de versões antigas.

A diferença mortal entre `isNaN()` global vs o construtor moderno estrito `Number.isNaN()`.

#### 1. A versão Global Antiga: `isNaN()`

A função isolada `isNaN()` sofre da terrível **coerção implícita** que detestamos (lembre das aulas dos capítulos passados). Ela tentará forçar tudo ao redor para número antes de rodar o teste:

```js
isNaN(NaN); // true
isNaN("texto"); // true  (Atenção!)
isNaN(undefined); // true  (Atenção!)
```

Percebe o que ocorreu nessas duas últimas variáveis? Como a palavra `"texto"` não é um número, a função forçou o "texto" a tentar a avaliação matemática de fundo para o tipo numérico, resultando no próprio primitivo `NaN` e caindo em um Falso Positivo terrível validando como se o conteúdo que enviamos inicialmente já fosse puramente o erro, atrapalhando a rastreabilidades!

#### 2. O Método Moderno Definitivo: `Number.isNaN()`

No ES6 a linguagem nos brindou com o `Number.isNaN()`. Totalmente estrito, ele checa não apenas se a abstração representa erro matemático final, e sim se e **somente se** o pacote enviado na variável equivale perfeitamente e estritamente ao tipo primitivo número na memória, de face intocada, contendo aquele resultado de erro (sem coerção nenhuma antes da verificação!):

```js
Number.isNaN(NaN); // true
Number.isNaN(10 / "A"); // true

Number.isNaN("texto"); // false! (A variável nem é do tipo Número original, barrou!)
Number.isNaN(undefined); // false! (Variável Ausente de Valor, não é erro matemático!)
```

Sempre que vir no mercado dezenas de `isNaN(` nos códigos alheios, procure refatorar ativamente para `Number.isNaN()` se você quiser blindar validações em suas funções de recebimento de parâmetros.
