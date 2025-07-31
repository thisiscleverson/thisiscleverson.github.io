---
title: Uma introdução à árvore binária
date: 2025-07-31 19:00:00 -0300
summary: "Árvores binárias são estruturas de dados importantes na ciência da computação e podem ser usadas para resolver muitos problemas na programação. Nesse post, vamos falar um pouco sobre essa estrutura incrível..."
comments: false
tags: ['estutura de dados', 'algoritmo']
---


Árvores binárias são estruturas de dados hierárquicas compostas por nós, onde cada nó tem no máximo dois filhos: um à esquerda e outro à direita. Devido à sua eficiência em operações, essa estrutura é amplamente usada em algoritmos como busca, inserção e exclusão de dados. Por ser uma estrutura hierárquica, ela organiza e facilita o acesso e a manipulação dos dados.

Diferente de outras estruturas de dados, a árvore binária tem algumas características peculiares. Cada nó contém um valor e dois ponteiros referências para seus filhos, permitindo a navegação pela estrutura. Além disso, cada árvore contém um nó raiz (nó pai) em seu ponto superior e cada nó pode ter zero ou mais "filhos", isso significa que cada nó na árvore binária pode ter subárvores.

![imagem da árvore binária](/media/arvore-binaria/binary_tree.png)


## Estrutura da árvore binária

Uma árvore binária pode ser representada por 3 partes:

- Valor.
- Ponteiro para o filho da esquerda.
- Ponteiro para o filho da direita.

![diagrama de representação da árvore binária](/media/arvore-binaria/diagrama-representacao-arvore-binaria.png)

Podemos construir essa representação do nó utilizando uma `class`, contendo essas 3 características citadas à cima. Em Python, isso fica da seguinte forma:

```python
class No:
	def __init__(self, valor):
		self.valor = valor
		self.esquerda = None
		self.direita = None
```
**Exemplo de uso:**

Vejamos um exemplo de uma árvore binária com 4 nós contendo os seguintes valores (1,2,3 e 4).

```python
class No:
	def __init__(self, valor):
		self.valor = valor
		self.esquerda = None
		self.direita = None
		
# criando os nós da árvore binária
primeiro_no = No(1)
segundo_no = No(2)
terceiro_no = No(3)
quarto_no = No(4)

#conectando os nós da árvore binária
primeiro_no.esquerda = segundo_no
primeiro_no.direita = tercceiro_no
segundo_no.esquerda = quarto_no
```

No código a cima, criamos 4 nós, **primeiro_no**, **segundo_no**, **terceiro_no** e **querto_no** com valores de 1 a 4. Logo após, conectamos esses nós utilizando os ponteiros 'esquerda' e 'direita'. Essa árvore terá a seguinte representação:

![dasda](/media/arvore-binaria/binary_tree_example_01.png)


## Inserindo um novo elemento na árvore binária.

Inserir um novo elemento na árvore binária significa procurar por um lugar vazio. E para fazer isso, primeiro devemos adicionar um nó raiz (nó principal) na estrutura da árvore. Em seguida, as inserções subsequentes envolvem a busca de um lugar vazio em cada nível da árvore. Quando esse lugar vazio (ponteiro) é encontrado, um novo nó é inserido. 

```Python
from collections import deque

def inserir(arvore, valor):
	if arvore is None:
		return No(valor)
	
	fila = deque([arvore])
	
	while fila:
		
		no = fila.popleft()
		
		if no.esquerda is None:
			no.esquerda = No(valor)
		else:
			fila.append(no.esquerda)
			
		if no.direita is None:
			no.direita = No(valor)
		else:
			fila.append(no.direita)
	
	return arvore
```

**Exemplo inserindo alguns elemento:**
```Python
arvore = None # A árvore não tem nenhum elemento.

elementos = [1,2,3,4,5,6,7]
for elemento in elementos:
	arvore = inserir(arvore, elemento)
```

Para poder inserir um novo elemento, precisamos procurar por espaços vazios. O algoritmo usa a estrutura de filas para poder fazer pesquisa de nós que não estejam apontando para nenhum nó existente.

```Python
# adicionando todos os nós existente da árvore binária na fila. 
fila = deque([arvore])
 	
while fila:
	# retirar o primeiro nó que está a frente da fila.
	no = fila.popleft()
```

Logo após retirarmos o nó que está na frente da fila, verificamos se os ponteiros da **esquerda** e **direita** estão apontando para algum nó existente na estrutura. Caso não esteja, o algoritmo adiciona o novo elemento no local vazio. Se ambos os ponteiros estiverem apontando para um nó existente, esses **nós** serão adicionados ao final da fila. Isso será importante, pois, caso não exista espaço vazio no nó que está sendo analisado, será necessário procurar nos filhos desse nó.

```Python
if no.esquerda is None:
	no.esquerda = No(valor)
else:
	fila.append(no.esquerda)
			
if no.direita is None:
	no.direita = No(valor)
else:
	fila.append(no.direita)
```

Assim que finalizar a procura por um espaço vazio e adicionar o novo elemento, o algoritmo retorna à árvore com os valores atualizados.
