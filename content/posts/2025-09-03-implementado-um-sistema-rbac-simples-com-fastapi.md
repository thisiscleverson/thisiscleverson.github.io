---
title: "[Draft] Implementado um sistema RBAC simples com FastAPI"
date: 2025-09-03 21:57:23 -0300
summary: "Na maioria das vezes, quando estamos desenvolvendo um sistema, precisamos criar maneiras de restringir o acesso a determinados recursos ou funcionalidades. Nesse post, vamos discutir um pouco sobre o Role Based Access Control (RBAC)."
comments: true
tags: ['fastapi', 'RBAC']
mastodonpost: ""
---

<br>

> ⚠️ Este post é um rascunho dos estudos que estou fazendo sobre sistemas de controle de acesso, e ainda se encontra incompleto. Muitas das coisas desses post podem estar erradas e incompletas. Se você quiser contribuir com esse post, você pode deixar um comentário abaixo via [Fediverso](https://pt.wikipedia.org/wiki/Fediverso). 

<br>

## O que é Role Based Access controll (RBAC)

**Role Based Access Control (RBAC)** ou, em português, Controle de Acesso Baseado em Funções, é um mecanismo de segurança que restringe o acesso ao usuário com base em suas funções (Roles). Com RBAC, podemos controlar os níveis de acesso, atribuindo funções aos usuários e agrupando as permissões a um grupo de função (Roles).
 
Nesse post, vamos implementar e falar um pouco sobre o RBAC usando o [FastAPI](https://fastapi.tiangolo.com/) e [SQLAlchemy](https://www.sqlalchemy.org/). 


## Modelo das tabela

Para começar, vamos definir o nosso modelo de `users` que será nossa entidade de usuário.
Para o nosso exemplo, vamos definir somente o nome do usuário e a senha.

O modelo ficará da seguinte forma:

```python
@registry.mapped_as_dataclass
class User:
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
```

Agora, precissamos definir a entidade que vai representar as funções. Para isso, vamos criar mais um modelo que representará as funções. 

```python
@registry.mapped_as_dataclass
class Role:
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

```

Um usuário pode ter vários papéis, e para representar esse esquema, precisamos criar mais uma tabela intermediaria que interligará o usuário aos papeis. E para criar esse relacionamento de **Muito para Muito**, vamos usar chaves compostas. As chaves compostas vão ligar o id da tabela de `users` com o id da tabela `roles`.


```python
user_roles = Table('user_roles', registry.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True),
)
```

Para criar a relação N:N no sqlalchemy, podemos adicionar o campo `roles` no modelo `User`.

```python
user_roles = Table('user_roles', registry.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True),
)

@registry.mapped_as_dataclass
class User:
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]

    roles: Mapped[list["Role"]] = relationship(
		init=False,
		secondary=user_roles,
		backref='roled'
	)


@registry.mapped_as_dataclass
class Role:
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
```

O campo **roles** vai conter a função `relationship` que diz como as relações entres as tabelas irão se comportar. A função vai conter um campo chamdo `secondary` que ira especificar qual será a tabela intermediaria para criar a relação.

No final, a relação entre as tabelas, devem ficar dessa forma:

![Diagrama das tabela user role sem a entidade de permissões](/media/implementado-um-sistema-rbac-simples-com-fastapi/db-diagram-user-role.png)

**TODO:** Melhorar a imagem do diagrama das tabelas.

**TODO:** Pesquisar se é nescessario o `backref`.


## Verificando os acessos

Para verificar o acesso do usuário, vamos usar dois métodos. Um que verifica o **role** e outro que verifica as **permisões**. 

**Função para verificar os roles do usuário:**
```python
def has_roles(roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        user_roles = [role.name for role in current_user.roles]
		
		if not any(role in roles for role in user_roles):
			raise HTTPException(
				status_code=HTTPStatus.FORBIDDEN,
				detail="Operation not permitted"
			)
        return current_user

    return role_checker
```
A função `has_roles` tem uma função interna que vai verificar se o usuáro tem **pelomenos uma** role nescessaria para ter acesso ao recurso. Caso o usuáro não tenha as roles nescessaria, a função lançara o status [401 Unauthorized](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status/401) avisando que a operação não é permitida.

**TODO:** Explicar mais o dependencies.

Para usar a função, podemos usar [dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/?h=depen) do FastAPI. 
```python
@router.get("/", response_model=UserList, dependencies=[Depends(has_roles(["admin", "moderator"]))])
def read_users(
    session: Session,
    filter_user: Annotated[FilterPage, Query()],
):
    query = session.scalars(
        select(User).offset(filter_user.skip).limit(filter_user.limit)
    )

    users = query.all()

    return {"users": users}
```

Nesse caso, estamos limitando o acesso ao endpoint com base nos roles do usuário. Esse método resolve o nosso problema, mas nos limita. Se quisermos fazer o controle mais granulado, a verificação usando somente os roles não será suficiente.

Imagine o seguinte: Na nossa aplicação, temos um recurso acessado somente por um tipo de usuário. Caso precisemos adicionar mais um usuário para acessar essa funcionalidade, precisaríamos alterar o código adicionando mais uma verificação de role e fazer o deploy. E isso não é muito intuitivo e legal.

Para resolver esse problema, podemos criar uma entidade de permissão para registrar e gerenciar as permissões do nosso sistema. Com esse método, podemos ter uma flexibilidade maior e ter um registro claro de quem pode fazer o quê.


## Criando uma entidade de permissão

 Vamos criar uma tabela de permissão que faz relacionamento **N:N** com a tabela de `roles` igual o que vimos acima na com a tabelas de `users` e `roles`.
 
```python 
role_permissions = Table('role_permissions', registry.metadata,
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('permissions.id'), primary_key=True)
)

 @registry.mapped_as_dataclass
class Role:
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    permissions: Mapped[list["Permission"]] = relationship(secondary=role_permissions, back_populates="roles")


@registry.mapped_as_dataclass
class Permission:
    __tablename__ = "permissions"

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
```

A tabela de `permissions` é responsavel por registrar as permissões que temos no sistema. E a tabela `role_permissions` vai ser responsavel por criar a relação **Muitos pra Muitos** entre a tabela de `permissions` com a tabela `roles`. 

Agora podemos criar uma função que verifica a permissão do usuário. Essa função vai ser parecida com a função `has_roles`. Porém ela iria verificar uma unica permissão e não um conjunto de permissões como fizemos com a verificação de roles.

```python
def has_permission(permission: str):
    def permission_checker(current_user: User = Depends(get_current_user)):
        permissions = [perm.name for role in current_user.roles for perm in role.permissions]

        if permission not in permissions:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN,
                detail="Operation not permitted",
            )
        return current_user

    return permission_checker
```

Podemos usar o mesmo esqueme de injeção de dependencia usando o dependencies do fastAPI como fizemos acima. 

```python
@router.delete("/{user_id}", dependencies=[Depends(has_permission("user:delete"))])
def delete_user(
    user_id: int,
    session: Session,
):
    db_user = session.scalar(select(User).where(User.id == user_id))
    session.delete(db_user)
    session.commit()

    return {"message": "User was deleted"}
```

Ou se você preferir, pode usar a função em um bloco `if`:

```python
# security.py
def has_permission(permission: str, current_user: User):
	permissions = [perm.name for role in current_user.roles for perm in role.permissions]

	if permission in permissions:
	    return current_user
	return None

# user.py
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    session: Session,
	current_user: User = Depends(get_current_user),
):
	if not has_permission(current_user, "user:delete"):
		raise HTTPException(
			status_code=HTTPStatus.FORBIDDEN,
			detail="Operation not permitted",
		)
	
	db_user = session.scalar(select(User).where(User.id == user_id))
	session.delete(db_user)
	session.commit()

    return {"message": "User was deleted"}
```
Você pode fazer esse controle de diversas formas. Sinta-se a vontade para escolher o jeito que lhe agrade.

Pronto, agora podemos ter separar a responsabilidade de verificar o acesso somente com roles. Agora, quando precissamos adicionar mais um grupo de usuário para acessar o recurso, basta atualizar as permissões ao seu role. Isso permite que não precissamos alterar o codigo e fezer o deploy. Basta fazer adicionar ou remover as permissões do usuário.

## Conclusão

Nesse post falamos um pouco sobre Role-based-access-control (RBAC) e como aplicar usando o fastAPI. 

Existem outros modelos de controles além do RBAC -> Mas falamos somente de um deles.

Você pode acessar o meu [repositorio]() e ver com mais detalher como apliquiei o mecanismo de acesso. 

> Ideia: deixar essa frase para a conclusão do texto.
> "restringir e controlar o que os usuários podem fazer e quais recursos eles podem acessar."


## Roteiro

- [x] O que é RBAC e Como funciona o RBAC
- [x] Como funciona?
- [x] Tabelas e relacionamento
    - [x] Para que serve as tabelas `user_roles` e `role_permissions`. 
	- [x] Implementando os modelos no sqlalchemy
	- [x] Modelo de permissẽs
- [x] has_roles - Controle de acesso usando roles.
- [x] has_permission - Controle de acesso usando permissões.
- [ ] nomeclatura de das permissões.
- [x] Conclusão

## Referências


- [Implementação de Controle de Acesso Baseado em RBAC em Python com Modelagem, Configuração e Testes](https://www.tabnews.com.br/matheus1714/implementacao-de-controle-de-acesso-baseado-em-rbac-com-python-com-modelagem-configuracao-e-testes)
- [8 Role-Based Access Control (RBAC) examples in action](https://workos.com/blog/role-based-access-control-example)
- [Flask - Role Based Access Control](https://www.geeksforgeeks.org/python/flask-role-based-access-control/)
