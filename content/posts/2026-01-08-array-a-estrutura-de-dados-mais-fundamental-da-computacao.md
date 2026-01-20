---
title: "Array: A estrutura de dados mais fundamental da computação"
date: 2026-01-08 17:30:50 -0300
summary: "Arrays são as estruturas de dados mais fundamentais da computação. Porém, muitos desenvolvedores não entendem o seu funcionamento. Nesse post, falo um pouco sobre o funcionamento de arrays estáticos e quais são suas vantagens e desvantagens."
comments: true
tags: ["estrutura de dados"]
mastodonpost: "https://bolha.us/@cleverson/115861432730503283"
---

<details close style="margin-bottom: 2em;">
<summary><strong>Índices</strong></summary>
<ul>
  <li><a href="#como-funciona-a-memoria-do-computador">Como funciona a memória do computador?</a></li>
  <li><a href="#o-que-e-um-array">O que é um array?</a></li>
  <li><a href="#complexidade">Complexidade</a></li>
  <li><a href="#tipos-unidimensional-e-multidimensionais">Tipos unidimensional e multidimensionais</a></li>
  <li><a href="#vantagens-e-desvantagens">Vantagens e Desvantagens</a></li>
  <li><a href="#arrays-em-linguagens-compiladas-e-interpretadas">Arrays em linguagens compiladas e interpretadas</a></li>
  <li><a href="#referencias">Referências</a></li>
</ul> 
</details>


Array, em linguagens de programação compiladas, é uma estrutura de dados que permite armazenar uma **coleção** de dados do mesmo tipo em uma única variável. Essa definição é importante, pois existe uma diferença entre arrays em linguagens compiladas e interpretadas. 


Em linguagem de programação como C, Java ou qualquer outra que seja compilada, você é obrigado a definir um tipo e a quantidade de elementos que aquele vetor irá armazenar na memória. 

**Mas por que disso?**

O motivo disso vem da lógica de como o array funciona por debaixo dos panos. As linguagens de programação não armazenam esses dados de forma aleatória na memória do seu computador. Existe uma logica de funcionamento!

## Como funciona a memória do computador?

Antes de entendermos como os arrays funcionam, precisamos entender como a memória do computador funciona!

Imagine a memória do computador como se fosse um armário com várias gavetas vazias, prontas para armazenar algum item. Essas gavetas na memória são chamadas de **slot**. E cada gaveta pode armazenar apenas um único objeto. Portanto, quando você decide guardar dois itens no armário, você precisa abrir duas gavetas para acomodar esses dois itens na gaveta.

![](/media/array-a-estrutura-de-dados-mais-fundamental-da-computacao/armario-ilustracao-memoria.jpg)

A memória de seu computador funciona mais ou menos como o exemplo citado. Quando você precisa salvar algum dado na memória, seu computador libera um slot (espaço na memória) para poder armazenar o dado. É como se fosse um conjunto de várias gavetas, e cada gaveta tem um endereço que você pode acessar e recuperar aquele dado que foi guardado.

Então quando você armazena um item na memória, você esta pedindo ao seu computador um slot na memória para guardar aquele item.

## O que é um array?

Um array, resumidamente, significa que os dados serão organizados continuamente (um ao lado do outro) na memória. Isso é, quando declaramos um array, e definimos um tamanho fixo, a linguagem vai pedir ao computador, *slots* que estejam livres um a lado do outro.

**Exemplo:**

```c
// C
int numeros[3] = {1, 2, 3};
```

![ilustração de dados armazenados continuamente na memória](/media/array-a-estrutura-de-dados-mais-fundamental-da-computacao/dados-na-memoria-01.png)

Cada elemento em um array é acessado por uma posição numérica, denominada índice, cada índice indica a localização do elemento na estrutura. Como os elementos estão organizados de forma sequencial, fica fácil localizar esses elementos. O primeiro elemento é acessado pelo índice zero, o segundo pelo índice um, e assim por diante.

## Complexidade

Uma das vantagem do array é sua capacidade de **acessar** e **alterar** os dados de forma **constante**. Isso é, por organizar os dados de forma sequencial (um ao lado do outro), é fácil saber qual é o próximo dados da sequencia, sem precisar percorrer todos os elementos desse vetor. Na computação, dizemos que essa complexidade é O(1). 

![](/media/array-a-estrutura-de-dados-mais-fundamental-da-computacao/array-organizacao-sequencial.png)

**Exemplo:**

Acessando elementos:
```c
// C
int numeros[5] = {1, 2, 3, 4, 5};
printf("%d", numero[2]); // out: 3
```

Alterando elementos:
```c
// C
numero[0] = 10;
printf("%d", numero[0]); // out: 10
```

## Tipos unidimensional e multidimensionais

Arrays unidimensionais, chamados também de vetores, são listas lineares onde os elementos podem ser acessados através de um índice.

**Array unidimensional:**
```C
int vetor[5] = {1, 2, 3, 4, 5};
```

Já os arrays multidimensionais podem ser representados através de tabelas ou matrizes. Elas são capazes de armazenar os dados por múltiplas dimensões.

**Array multidimensional:**
```C
int tabela[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
```

## Vantagens e Desvantagens

Por ter uma complexidade de operações de O(1), arrays são uma ótima escolha quando queremos rapidez no acesso e alterações de dados.
Para algoritmos de ordenação, pilha e filas, os arrays são uma ótima escolha quando queremos agilidade. 

Mas, em contrapartida, quando estamos desenvolvendo nossas aplicações e não sabemos quanto de memória precisamos alocar, os arrays não são uma ótima escolha. Se alocamos memória demais, vamos estar criando um desperdício computacional e, se alocamos pouca memória, será preciso realocar os itens para um espaço maior, e fazer isso gera um custo computacional alto. Para isso, as listas encadeadas são uma ótima opção para resolver esses problemas.


## Arrays em linguagens compiladas e interpretadas

Quando você faz isso em python por exemplo:

```Python
# Python
a = [8, 5, 2, 9, 3]
```
ou em JavaScript:

```javascript
// JavaScript
let a = [8, 5, 2, 9, 3]
```
Você não está criando um array estático. Por debaixo dos panos, essas linguagens não usam array como nas linguagens compiladas. 

Por serem linguagens interpretadas e permitirem a inserção de novos elementos de forma dinâmica, elas usam [listas encadeadas](https://pt.wikipedia.org/wiki/Lista_ligada) para poder representar vetores. Em Python, por exemplo, os vetores são chamados de [lista (list)](https://docs.python.org/3/library/stdtypes.html#typesseq-list) e não array. Python não suporta a criação de vetores estáticos como no C/C++ ou Java. 


--- 

## Referências

- [Arranjo (computação) - Wikipedia](https://pt.wikipedia.org/wiki/Arranjo_(computação))
- [O que é um Array? Entenda este termo comum nas linguagens de programação](https://www.forenz.com.br/o-que-e-um-array-entenda-este-termo-comum-nas-linguagens-de-programacao/)
- [Entendendo Algoritmos Um Guia Ilustrado Para Programadores E Outros Curiosos Autor ( Aditya Y. Bhargava)](https://archive.org/details/entendendo-algoritmos-um-guia-ilustrado-para-programadores-e-outros-curiosos-aut_202408/page/n11/mode/2up)
