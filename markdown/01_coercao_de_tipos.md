# Capítulo 1 — Coerção de Tipos

A coerção de tipos é, indiscutivelmente, uma das mecânicas mais conhecidas, fascinantes e perigosas do JavaScript. Sendo uma linguagem de tipagem dinâmica e fraca, o JavaScript tenta arduamente (e silenciosamente) "ajudar" o desenvolvedor convertendo tipos incompatíveis para que as operações funcionem. Esse processo é chamado de **coerção implícita**.

A seguir, abordaremos os principais cenários onde essa ajuda mais atrapalha do que ajuda!

### O Operador de Soma (`+`): O Grande Vilão

A regra de ouro da coerção em JS está no operador `+`. Se **qualquer um** dos lados da operação for uma string, o JavaScript desiste de somar e decide **concatenar** (juntar texto).

```js
"5" + 1; // '51'
1 + "5"; // '15'
"5" + true; // '5true'
```

O interpretador converte o que não for texto em string e junta os valores.

### Outros Operadores Matemáticos (`-`, `*`, `/`)

Diferente do `+`, os outros operadores matemáticos fazem exatamente o caminho inverso. Eles não entendem texto, então forçam a conversão de strings de volta para **números**.

```js
"5" - 1; // 4
"10" / "2"; // 5
"5" * 2; // 10
```

Se a string não puder ser convertida em um número válido, a linguagem devolve um `NaN` (Not-A-Number).

```js
"maçã" - 1; // NaN
```

### O Truque do Mais Unário (`+`) e do Incremento (`++`)

Muitos desenvolvedores usam a coerção implícita de propósito para transformar strings em números de forma ultra-concisa.

O operador unário `+` (colocado antes da string) tenta forçar seu valor para numérico:

```js
const idade = +"25";
console.log(typeof idade); // "number"
```

O incremento `++` ou decremento `--`, mesmo aplicado em uma variável que guarda uma string numérica, fará a conversão para número, somará (ou subtrairá) 1 e salvará de volta na variável como tipo numérico:

```js
let contador = "99";
contador++;
console.log(contador); // 100
console.log(typeof contador); // "number"
```

A grande pegadinha e contraste fascinante para provar a coerção matemática é se fôssemos somar com o `+ 1` manual em vez do `++`:

```js
let outroContador = "99";
outroContador = outroContador + 1;
console.log(outroContador); // "991" (Concatenou devido a regra de ouro do +!)
```

#### E o Antes vs. Depois (`++x` vs `x++`)?

Já que estamos falando sobre incremento, existe uma diferença fundamental dependendo se o `++` vem **antes** (pré-incremento) ou **depois** (pós-incremento) da variável. A coerção para número ocorre em ambos os casos, mas o valor _comunicado_ ao código na mesma linha muda:

```js
let a = "10";
let b = a++; // Pós-incremento
console.log(b); // "10" (Ele te entrega o valor original antes de modificar)
console.log(a); // 11   (Mas a variável 'a' foi atualizada depois!)

let y = "10";
let z = ++y; // Pré-incremento
console.log(z); // 11   (Ele já soma 1 antes de te entregar o valor na linha da atribuição)
console.log(y); // 11   (E a variável 'y' já estava atualizada)
```

> **Cuidado:** Embora o uso do `++` pareça elegante para conversão rápida de contador, observe que a diferença de posição é sutil e pode gerar bugs difíceis se usada em condições dentro de um `if()` ou atribuições conjuntas.

### Coerção Explícita: Usando `Number()`

Para evitar dores de cabeça, a recomendação moderna é fugir da coerção implícita e usar a **coerção explícita**. Se a sua intenção é ter um número, invoque a função global `Number()`.

```js
Number("5") + 1; // 6
```

O `Number()` e o truque do `+` unário se comportam da mesma forma sob o capô. Veja algumas pegadinhas clássicas na conversão baseada no `Number()`:

```js
Number(""); // 0  (Strings vazias viram zero)
Number(" "); // 0  (Isso mesmo, espaços em branco viram zero!)
Number(null); // 0
Number(true); // 1
Number(false); // 0
Number(undefined); // NaN
```

Por outro lado, não confunda `Number()` com `parseInt()`. O `parseInt()` foi criado especificamente para "ler" números partindo do começo de um texto, ignorando letras posteriores, desde que a string inicie por um número.

```js
Number("10px"); // NaN (Ele é rigoroso, a string inteira deve ser um número válido)
parseInt("10px"); // 10 (Ele "caça" a base numérica inicial até esbarrar no "p")

Number(""); // 0
parseInt(""); // NaN (Não achou nenhum dígito)
```

### Booleans como Números

Como vimos acima nas conversões do `Number()`, booleanos representam os estados da máquina (`true` como 1, `false` como 0). Nas matemáticas embutidas:

```js
true + true; // 2
true + false; // 1
10 - true; // 9
```

### Coerção para Booleano: O Truque da Dupla Negação (`!!`)

Assim como o mais unário (`+`) força números, duas exclamações juntas (`!!`) são a forma rápida (e explícita) de forçar qualquer valor para Booleano. A primeira exclamação inverte e converte para booleano; a segunda exclamação inverte novamente para devolver o estado booleano "truthy/falsy" real:

```js
!!"um texto"; // true
!!""; // false
!!1; // true
!!0; // false
```

Evidentemente, o uso do `!!` é apenas um truque de sintaxe herdado de práticas mais antigas. Atualmente, se você deseja fazer essa mesma conversão explícita de forma muito mais semântica e legível para sua equipe, você pode (e deve) usar a função construtora nativa `Boolean()`:

```js
Boolean("um texto"); // true
Boolean(0); // false
```

Ambas as abordagens têm exatamente a mesma performance e o mesmo resultado, então a escolha acaba sendo baseada no padrão de limpeza de código aprovado pelo seu time!

### Coerção para Texto (`String()` vs `.toString()`)

Ao precisar converter um valor para texto, você tem duas opções:

```js
const val = 100;
String(val); // "100"
val.toString(); // "100"
```

A grande diferença na hora de escolher os dois mora nos valores considerados vazios (`null` e `undefined`). O `.toString()` é um método do protótipo e precisa ser chamado a partir de um objeto existente. Tentar chamar de um valor "nulo" vai quebrar sua aplicação de imediato:

```js
String(null); // "null" (Seguro)
null.toString(); // TypeError: Cannot read properties of null

String(undefined); // "undefined" (Seguro)
undefined.toString(); // TypeError: Cannot read properties of undefined
```

Vale lembrar que a sintaxe extremamente moderna de usar texto entre crases (Template Literals) invoca uma poderosa **coerção implícita para texto** embutida na linguagem, disparando os métodos de formatação textual e varrendo o que estiver lá dentro de maneira segura do mesmo jeito que o global `String()` atua:

```js
const tempVal = null;
const url = `site.com/${tempVal}`; // "site.com/null" (Seguro, não lança TypeError)
```

### E os Objetos e Arrays?

Quando o JavaScript tenta somar listas e objetos vazios (`{} + []`), ele engatilha internamente os métodos ocultos do protótipo em cascata chamados `.valueOf()` e depois o `.toString()`, o que rende bizarrices famosas de resultados textuais imensos e `[object Object]`. Mas nós vamos aprofundar muito nisso nos próximos capítulos!

### Resumo

A coerção não é simplesmente um erro do JavaScript; é uma característica intencional da linguagem (uma "feature", não um "bug"). A melhor forma de lidar com isso é **prevenir a coerção implícita**. Sempre padronize os tipos de entrada da sua função e utilize `Number()`, `String()` e `Boolean()` para garantir as conversões que você realmente almeja fazer.
