# Capítulo 11 — Classes, POO e o Construtor Traidor

O JavaScript (e o TypeScript) trouxeram as `class` para facilitar a vida de quem gosta de Programação Orientada a Objetos. No entanto, o sistema de classes no JavaScript é apenas uma "camada de açúcar" sobre o motor de protótipos da linguagem, o que gera comportamentos inesperados em relação a outras linguagens como Java ou C#.

### 1. Privado de "Mentira" vs Privado de "Verdade"

Muitos desenvolvedores acreditam que ao colocar um underline antes de uma propriedade (`this._nome`), ela está protegida e inacessível de fora da classe. No JavaScript, isso é apenas uma **convenção social**: um aviso entre programadores dizendo "por favor, não mexa aqui".

A pegadinha é que qualquer um pode ler ou alterar essa propriedade de fora, quebrando todo o seu encapsulamento. Para ter uma privacidade real, garantida pelo motor da linguagem, você deve usar a hashtag (`#`):

```javascript
class Usuario {
  _apelido = "Carlos"; // Privado de mentira (qualquer um acessa)
  #id = 123; // Privado de verdade (o motor bloqueia o acesso externo)

  mostrarId() {
    console.log(this.#id); // Funciona aqui dentro
  }
}

const u = new Usuario();
console.log(u._apelido); // "Carlos" (Acessível!)
console.log(u.#id); // SyntaxError: Private field '#id' must be declared in an enclosing class
```

### 2. O Esquecimento do super()

Se você criar uma classe que herda de outra (`extends`), o JavaScript impõe uma regra rígida: a classe pai deve ser "construída" antes que a classe filha possa sequer tocar no próprio contexto (`this`).

Tentar usar `this` antes de chamar o método `super()` resultará em um erro fatal de referência.

```javascript
class Usuario {
  constructor(nome) {
    this.nome = nome;
  }
}

class Administrador extends Usuario {
  constructor(nome, permissao) {
    this.permissao = permissao; // Erro! O motor ainda não sabe quem é o 'this'
    super(nome); // O super() deve vir SEMPRE antes do uso do this
  }
}
```

### 3. Métodos Estáticos não pertencem à Instância

É comum pensar que ao definir um método em uma classe, todos os objetos criados com `new` terão acesso a ele. No entanto, métodos marcados como `static` morrem na "fábrica" (a classe) e não são passados para os objetos produzidos.

```javascript
class Usuario {
  constructor(nome) {
    this.nome = nome;
  }

  static formatar(u) {
    return u.nome.toUpperCase();
  }
}

const u = new Usuario("carlos");
console.log(Usuario.formatar(u)); // "CARLOS" (Caminho correto)
console.log(u.formatar()); // TypeError: u.formatar is not a function (A pegadinha!)
```

### 4. O Exemplo do "Bypass" no Construtor

Por fim, existe um erro de arquitetura muito comum onde suas regras de validação são completamente ignoradas no momento do nascimento do objeto. Isso acontece quando o construtor acessa propriedades internas diretamente em vez de passar pelos seus próprios métodos de validação (Getters e Setters).

Imagine uma classe `Usuario` com regras estritas: o nome não pode ser vazio e a idade não pode ser negativa:

```typescript
class Usuario {
  constructor(
    private _nome: string, // Atalho do TypeScript que faz bypass no Setter
    private _idade: number,
  ) {}

  set nome(valor: string) {
    if (!valor) throw new Error("Nome inválido");
    this._nome = valor;
  }

  set idade(valor: number) {
    if (valor < 0) throw new Error("Idade inválida");
    this._idade = valor;
  }
}

// A pegadinha silenciosa:
const u = new Usuario("", -10); // Funciona e ignora os erros!
```

A pegadinha aqui é que ao usar atalhos de construtor ou atribuir valores diretamente para a variável interna (`this._nome = valor`), você pula o Setter. A forma correta é obrigar o construtor a passar pela validação:

```javascript
class Usuario {
  constructor(nome, idade) {
    // FORMA CORRETA: Atribui para a propriedade limpa, disparando o Setter
    this.nome = nome;
    this.idade = idade;
  }

  set nome(valor) {
    if (!valor) throw new Error("Nome inválido");
    this._nome = valor;
  }
  // ... resto da classe
}
```
