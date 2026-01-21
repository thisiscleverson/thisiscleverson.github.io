---
title: "Introdução à Linguagem C"
date: 2026-01-21 12:04:41 -0300
summary: "A linguagem C é uma das linguagens mais importantes da computação. Nesse post, falo um pouco sobre essa linguagem amplamente usada em sistemas operacionais e em sistemas embarcados."
comments: true
tags: ['C', 'curso', 'linguagem de programação']
mastodonpost: ""
---

> Essa publicação são notas dos meus estudos sobre a linguagem C. Você pode acessar todas as minhas anotações e códigos no meu repositório do Codeberg: [C-4-noobs](https://codeberg.org/thisiscleverson/C-4-noobs/src/branch/main/notas/basico/introducao.md)

<br>

## História da linguagem C

A linguagem C foi criada em 1972 por Dennis Ritchie. C é derivada de duas outras linguagens: [Algol 68](https://en.wikipedia.org/wiki/ALGOL_68) e [BCPL](https://pt.wikipedia.org/wiki/BCPL). O foco da linguagem C inicialmente foi o desenvolvimento de sistemas operacionais e compiladores. Em 1978, Dennis Ritchie e Brian Kernighan publicaram o livro: The C Programming Language por Kernigham & Ritchie. Este livro fez grande sucesso e ajudou muito a divulgar a linguagem.

## Visão geral

C é uma linguagem imperativa e procedural para implementação de sistemas. Sendo uma linguagem compilada, dá acesso completo à memória do computador. Hoje em dia, a linguagem C é amplamente usada no desenvolvimento de aplicações, sistemas operacionais e sistemas embarcados. 

## Função main

A função `main()`, é o entry point onde o compilador irá iniciar o programa. Ela é responsável por indicar ao compilador onde ele deve iniciar o programa. 

**Estrutura da função main:**

```C
int main(){
	/* Código */
	return 0;
}
```
O `int` da função main indica que a função irá retornar um número inteiro. O comando `return` retorna o valor 0, que é interpretado pelo sistema operacional que a função main() foi executada sem erros.


## Hello World na linguagem C

Fazer um Hello World em C é bem simples.

```C
#include <stdio.h>

int main(void){
      printf("Hello, World!");
      return 0;
}

```

Para poder imprimir um `Hello, World!` na linguagem C, vamo precisar importar à biblioteca [stdio.h](pt.wikipedia.org/wiki/Stdio.h). Com ela, vamos ter disponível a função `printf`, responsável por imprimir no console.

--- 

### Links e Referências

- [https://pt.wikipedia.org/wiki/Dennis_Ritchie](https://pt.wikipedia.org/wiki/Dennis_Ritchie)
- [https://pt.wikipedia.org/wiki/C_(linguagem_de_programa%C3%A7%C3%A3o)](https://pt.wikipedia.org/wiki/C_(linguagem_de_programa%C3%A7%C3%A3o))
- [https://www.youtube.com/watch?v=mYQmbpWOj1o&list=PLZ8dBTV2_5HTGGtrPxDB7zx8J5VMuXdob&index=3](https://pt.wikipedia.org/wiki/C_(linguagem_de_programa%C3%A7%C3%A3o))




