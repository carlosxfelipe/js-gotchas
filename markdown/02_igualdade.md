# Capítulo 2 — Igualdade Frouxa (`==`) vs Igualdade Estrita (`===`)

É muito comum começarmos a programar em JavaScript e utilizarmos `==` instintivamente, como faríamos na matemática ou em outras linguagens tradicionais. Contudo, em JS o uso de comparadores de igualdade frouxa (`==`) e igualdade estrita (`===`) dita uma regra colossal do comportamento do seu código: a **coerção automática** que estudamos no capítulo anterior entra em cena.

### Igualdade Frouxa (`==` e `!=`)

Quando você utiliza dois sinais de igual (`==`), você está pedindo ao JavaScript para testar se os **valores** são equivalentes, mesmo que ele precise forçar os **tipos** para conseguir fazer essa validação. Ele dispara nos bastidores um complexo algoritmo conhecido como _Abstract Equality Comparison_.

```js
"10" == 10; // true  (A string texto vira número para comparar)
0 == false; // true  (O false vira 0)
"" == false; // true  (A string vazia vira 0, o false vira 0)
[1] == 1; // true  (O Array extrai seu valor e vira número)
```

Essas conversões silenciosas deixam muitas portas abertas para lógicas frágeis. O JS tentará transformar tudo em números (e depois strings, e depois primitivos) até encontrar algo que bata com o outro lado.

#### O Caso Especial de `null` e `undefined`

Existe uma regra exclusiva da especificação ECMAScript para esses dois tipos de ausência de valor: eles são "frouxamente" iguais entre si, mas não sofrem coerção natural para equivalerem a mais nada.

```js
null == undefined; // true!
null == 0; // false (Nenhum dos dois se converte para zero aqui)
undefined == ""; // false
```

Por muito tempo, desenvolvedores escreviam `if (variavel == null)` justamente como um truque preguiçoso para validar, de uma só vez, se a variável era vazia, nula ou "undefined".

### Igualdade Estrita (`===` e `!==`)

Para salvar a integridade de uma base de código, foi introduzido o operador de três sinais (`===`). Ele testa o **Tipo** e o **Valor**. Nenhuma conversão (coerção) é realizada! Se os dois operandos não pertencerem à mesma tipagem pura, a resposta morre logo na partida declarando inequivocamente como falso.

```js
"10" === 10; // false (Tipos diferentes: String vs Número)
0 === false; // false
null === undefined; // false

// Somente se ambos forem do exato mesmo tipo:
10 === 10; // true
"texto" === "texto"; // true
```

### O Comparador Supremo: `Object.is()`

Você já descobriu que deve sempre fugir do `==` e abraçar o `===`. Contudo, existem algumas exceções bizarras até mesmo dentro da verificação mais estrita de todas.
Observe o comportamento do JavaScript nestes dois casos peculiares:

```js
NaN === NaN; // false
-0 === 0; // true
```

Essas peculiaridades não agradavam quando construtores modernos precisavam garantir que dois elementos eram absolutamente idênticos — não importando os bugs bizarros descritos anteriormente do `NaN`. Então foi introduzida na linguagem a função `Object.is()` que atua como **Igualdade Estrita Suprema e Fiel**:

```js
Object.is(NaN, NaN); // true (Finalmente uma comparação de erro igual avaliada certa)
Object.is(-0, 0); // false (Diferenciação clara e forte do sinal da memória real)
```

### Regra de Ouro

Use sempre `===`. Nunca (ou quase nunca) deixe a linguagem adivinhar as conversões pelo código solto de sua aplicação — se precisar dessa coerção, faça-a você mesmo explicitamente antes da linha do teste. E só use `Object.is()` caso lide com matrizes matemáticas complexas e lógicas de validação de `-0` zero negativo e verificação de NaNs.
