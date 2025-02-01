Dando continuidade a nossa saga nos algoritmos, vamos explorar um algoritmo bem interessante que faz busca em grafos e que explora todos os elementos em um determinado nível antes de pesquisar o próximo nível.

> **ps:** esse post foi baseado na minha leitura do livro [Entendendo Algoritmos: Um Guia Ilustrado Para Programadores e Outros Curiosos](https://www.amazon.com.br/Entendendo-Algoritmos-Ilustrado-Programadores-Curiosos/dp/8575225634/ref=sr_1_1?keywords=entendendo+algoritmos&sr=8-1), caso queira se aprofundar melhor e entender mais sobre, indico muito a leitura.

<hr>

O algoritmo de **pesquisa em largura** (Breadth-First Search ou BFS, em inglês) é um algoritmo de busca em escala. O BFS é um algoritmo usado para percorrer ou pesquisar uma estrutura de dados em forma de **árvore** ou **grafo**.  Começa em um nó, chamado raiz, e verifica todos os seus vizinhos antes de passar para os vizinhos dos vizinhos. Basicamente, ele verifica primeiro os nós mais próximos antes de seguir para os mais distantes.

mas antes de entender o algoritmo e sua implementação, temos que entender um pouco sobre grafos. 


## E o que são grafos?



Grafos são uma estrutura de dados usadas para representar **conexões** entre elementos. Os grafos são formados por ***vértice*** e ***arestas*** e uma vértice pode se conectar com outras vértices assim criando conexões entre elas, essas conexões são chamadas de vizinhos.   

**representação de um grafo:** 

![](https://i.imgur.com/qZJirIG.png)


![](https://imgur.com/WeKcIDG.png)


Os grafos são divido em dois tipos **direcionados** e **não direcionados**. Os grafos direcionados, ou dígrafo, é um tipo de grafo em que cada aresta tem uma direção associada. Isso significa que a relação entre dois vértices ocorre em apenas um sentido. Já os grafos não direcionados é um tipo de grafo em que não há direção associada às arestas. Nesse tipo de grafo, a relação entre dois vértices é bidirecional, o que significa que ambos os vértices são considerados vizinhos um do outro.

![](https://imgur.com/JOxcGq9.png)

### Implementando grafos

Como grafos são basicamente vetores, onde cada vertices é conectado a outros vertices vizinhos, é fácil criar essa relação usando tabela hash.

### E o que é tabela hash?

Uma tabela hash é uma estrutura de dados que mapeia chaves a valores, permitindo acesso rápido aos valores associados a uma determinada chave. Isso é feito através de uma função hash que transforma a chave em um índice onde o valor correspondente é armazenado.

Um exemplo de tabela hash em Python:

```python
# Criando uma tabela hash (dicionário)
tabela_hash = {}

# Adicionando elementos à tabela hash
tabela_hash['chave1'] = 'valor1'
tabela_hash['chave2'] = 'valor2'

# Acessando valores na tabela hash
print(tabela_hash['chave1'])  # Saída: 'valor1'

# Verificando se uma chave existe na tabela hash
if 'chave2' in tabela_hash:
    print("Chave 'chave2' encontrada na tabela hash.")

```

<hr>

![](https://imgur.com/ubN5onv.png)

Como poderíamos representar essa relação "você --> seus amigos" na imagem a cima em código?

```python
grafo = {}

grafo['Você']   = ['Sylas', 'Talles', 'Paulo', 'Alice']
grafo['Talles'] = ['Sylas']
grafo['Sylas']  = []
grafo['Alice']  = ['Luiza', 'Julia']
grafo['Paulo']  = ['Thiago']
grafo['Thiago'] = []
grafo['Julia']  = []
grafo['Luiza']  = []
```
Como Sylas, Thiago, Julia e Luiza não tem vizinhos, eles recebem um array vazio. Com isso, usando tabela hash é possível representar grafos em código. 


## Como funciona a pesquisa em Largura ?

A pesquisa em largura é um dos algoritmos mais simples para realizar uma busca em um grafo. Ele responde a duas perguntas:


1- Existe algum caminho do vértice **A** até o **B**?

2- Qual o caminho minimo do vértice **A** até o **B**?


Para entender melhor a essas perguntas, vamos imaginar que você esteja em um shopping em outra cidade e você deseja voltar para sua casa. Você pretende voltar de ônibus, porém quer fazer o menor número de transferência de um ônibus para outro. As suas opções são a seguintes:

![](https://imgur.com/CcEkeMH.png)

Você tem **n** possibilidades para escolher qual ônibus pegar. Mas a questão é... quais rotas de ônibus eu escolho para fazer o menor número de transferência de um ônibus para outro? 

Você se questiona se é possível chegar até sua casa usando uma rota de ônibus? Veja todas a possibilidades com uma rota:

![rota1](https://imgur.com/DgpjLNp.png)

Bom, com uma rota não é possivel chegar até a casa. Mas com duas rotas, sera que é possível?

![rota2](https://imgur.com/A1OJSSy.png)

Mesmo com duas rota de ônibus ainda não é possível chegar até sua casa. E com três rotas, sera possível? 

![rota](https://imgur.com/nCqbvTt.png) 

Ahá! Você descobriu que com três rotas de ônibus é possível chegar na sua casa.

![](https://imgur.com/vbA0kbx.png)

Veja que existem outras possíveis rotas que levam ao destino final. Mas são mais longas, precisando pegar quatro ônibus para poder chegar até a casa. 

Com isso respondemos as duas perguntas, "Existe algum caminho do vértice **A** até o **B**?" " Qual o caminho minimo do vértice **A** até o **B**?" veja que no exemplo abordado, podemos verificar se existe um caminho para casa e identificar o caminho mais curto até lá.


## Filas


Antes de implementar o algoritmo de pesquisa em largura, precisamos entender um pouco sobre **filas**.
Mas o que são filas na programação?

Filas é uma estrutura de dados que  simulam o comportamento de uma fila na vida real. Nessa, o primeiro que entra é o primeiro a sair.

Imagina o seguinte: Você vai para uma padaria comprar pão, então você e umas três pessoas entra em uma fila para poder fazer o pagamento das compras nessa padaria. Você foi a primeira pessoa que entrou na fila, com isso, você sera a primeira pessoa a pagar e sair dessa fila. 

![](https://imgur.com/6WXy5ag.png)


Podemos implementar essa logica usando `arrays`. Em Python fica o seguinte:

```python
fila = []

def adicionar_item(item):
    fila.append(item)

def tirar_item():
    fila.pop(0)
```


<br>

A função **adicionar_item** adiciona um novo elemento ao final do array, enquanto a função **tirar_item** remove o primeiro elemento do array, permitindo assim simular o comportamento de uma fila em Python."

### Implementando o algoritmo

Como a gente já entendeu o básico sobre Grafos, Fila e a teoria do funcionamento do algoritmo, vamos implementar usando Python. 

Vamos imaginar um cenário que queremos encontrar um vendedor de bolo, porém não conhecemos ninguém que venda bolo. No entanto podemos verificar se algum de seus amigos conhece algum vendedor de bolo.


![](https://imgur.com/ubN5onv.png)

Então, como podemos escrever esse algoritmo para achar um vendedor de bolos?

<hr>
A implementação funcionará da seguinte forma:

1- Crie uma fila contendo todas as pessoas mais próximas de você que precisam ser verificadas.

2- Retire a primeira pessoa da fila para verificação.

3- Verifique se essa pessoa retirada da fila vende bolos".

4- Se essa pessoa for um vendedor de bolos, o algoritmo termina. Se não for, adicione todos os amigos dela à fila de verificação.

5- Repita os passos 2 a 4 até encontrar um vendedor de bolo ou até que a fila esteja vazia.

6- Se a fila estiver vazia e você não encontrou um vendedor de bolo , significa que não existe entre as pessoas verificadas um vendedor de bolo.


vamos começar criando um grafo contendo todas as pessoa que vão ser analisadas.

```python
grafo = {
    'Voce': ['Sylas', 'Talles', 'Paulo', 'Alice'], 
    'Talles': ['Sylas'],
    'Sylas': [],
    'Alice': ['Luiza', 'Julia'],
    'Paulo': ['Thiago'],
    'Thiago': [],
    'Julia': [],
    'Luiza': []
}
```

Agora vamos adicionar todos o seus vizinhos para uma fila.

>Lembre-se, grafo["voce"] fornecerá uma lista de todos os seus vizinhos,
como ['Sylas', 'Talles', 'Paulo', 'Alice'].
Todos eles são adicionados à fila de pesquisa.

```python
fila = []
fila += grafo['Voce']
```

Com o grafo e a fila criada, vamos tentar encontrar um vendedor de bolo.

```python
while fila:
    pessoa = fila[0]
    fila.pop(0)

    if 'z' in pessoa:
        print("achei a vendedora " + pessoa)
        break
    else:
        fila += grafo
```

<hr>

```python
pessoa = fila[0]
fila.pop(0)
```
O `fila[0]` vai pegar a primeira pessoa que está no array (fila), e a função `pop(0)` vai deletar ela da lista.

```python
if 'z' in pessoa:
```
Esse `if` vai verifica se o nome da pessoa tem a letra *z*. Se exite algum nome com a letra *z*, essa pessoa é um vendedor de bolo e algoritmo é finalizado.

>**ps:** Esse foi um exemplo besta que usei para tentar representar o funcionamento do algoritmo.

Caso a pessoa não seja um vendedor de bolo, o algoritmo adicionará os amigos dessa pessoa à fila e continuará funcionando até a última pessoa.


## Conclusão

Neste post, aprendemos sobre um algoritmo bem interessante e como aplicá-lo na prática, além de aprender algumas estruturas de dados como grafos, filas e tabela hash. Este post teve uma referência do livro [Entendendo Algoritmos: Um Guia Ilustrado Para Programadores e Outros Curiosos](https://www.amazon.com.br/Entendendo-Algoritmos-Ilustrado-Programadores-Curiosos/dp/8575225634/ref=sr_1_1?keywords=entendendo+algoritmos&sr=8-1), no qual estou me baseando. Agora é a sua vez de implementar esse algoritmo.