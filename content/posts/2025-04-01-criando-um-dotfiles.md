---
title: Criando um dotfiles
date: 2025-04-01 21:50:00 -0300
summary: "Configurar máquinas novas às vezes é um trabalho chato e demorado. E se houvesse um jeito de fazer tudo isso de forma automatizada? Nesse post, vamos falar sobre como eu criei um Dotfiles para fazer esse trabalho chato e demorado para mim."
comments: false
tags: ["automação", "dotfile"]
---


Recentemente, fiz uma troca de notebook, depois de 6 anos. E uma coisa que é muito chato quando se faz a troca é ter que configurar todas as minúcias do absoluto zero. Ter que passar dias ou até semanas procurando o programa certo, instalado os plugins e extensões, e configurar todos os detalhes daquele software acaba sendo algo muito estressante. 🤯

Uma das características que está na essência de nós programadores é querer automatizar tarefas repetitivas, nem que seja só pela diversão de saber se é possível. 
Por isso, decidir criar um script que configurasse todo meu sistema do zero, que deixasse do jeito que gosto e estou acostumando.

## Desafios

No início, eu estava pensando em criar um [shell script](https://pt.wikipedia.org/wiki/Shell_script) para fazer todas as instalações e configurações dos programas que eu uso.
No entanto, criar esse script me traria um trabalho enorme, e somado a isso, não tenho conhecimento aprofundado em shell. E isso estava me desmotivando muito em começar a criar o meu próprio dotfiles.

Coincidentemente, o [@Dunossauro](https://dunossauro.com/) estava fazendo em live um script com suas configurações. Então, fui até o [repositório](https://codeberg.org/dunossauro/dotfiles) do projeto para ver o que estava sendo usado e descobrir que ele estava usando o [Ansible](https://docs.ansible.com/ansible/latest/index.html) e o [Dotdrop](https://dotdrop.readthedocs.io/en/latest/getting-started/).

Após ver as ferramentas que o Dunossauro estava utilizando, comecei uma saga de 4 dias estudando e testando o [Ansible](https://docs.ansible.com/ansible/latest/index.html) e [Dotdrop](https://dotdrop.readthedocs.io/en/latest/) e tentando entender como eu poderia usá-los. 


## Criando os playbooks

O primeiro passo que tomei para criar o meu dotfiles foi definir os playbooks. E para isso, defini algumas categorias de aplicações e ferramentas que eu queria que o meu script instalasse. As categorias foram:

- Ferramentas de coding.
- Aplicações de interfaces gráficas.
- Aplicações de work.

Os [playbook](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html) usam um arquivo no formato [yaml](https://yaml.org/), que permite descrever um conjunto de tarefas a serem executadas. Com isso, comecei a definir todas as ferramentas de coding que uso. E o playbook ficou assim:

**coding.yml**

```yaml
---
- name: Installation of coding tools
  hosts: localhost

  tasks:
    - name: Install pipx
      become: yes
      package:
        name: pipx
        state: present

    - name: config pipx
      become: yes
      shell: pipx ensurepath

    - name: Install poetry
      become: no
      community.general.pipx:
        name: poetry
        state: present
        install_deps: true

    - name: Install mypy
      become: no
      community.general.pipx:
        name: mypy
        state: present
        install_deps: true

    - name: Install Podman
      become: yes
      package:
        name: podman
        state: present

    - name: Install podman-compose
      become: yes
      package:
        name: podman-compose
        state: present

    - name: Clone Pyenv
      git:
        repo: https://github.com/pyenv/pyenv.git
        dest: ~/.pyenv
```

Mas, o que isso faz? Bom, esse script vai instalar e configurar algumas aplicações que eu gosto de usar. As ferramentas são: Pipx, Poetry, Mypy, Podman, Podman-compose e o Pyenv.

O próximo playbook que eu definir foi de aplicações de interfaces gráficas. Mas antes de instalar as aplicações de interfaces gráficas, temos que resolver um probleminha.

## Limites do módulo package 

No Ansible é comum usarmos o módulo `package` para instalar pacotes. Porém, esse modulo que vem no Ansible usa o gerenciador de pacotes do sistema em que está sendo executado. 
No meu caso, eu uso o [Fedora Linux](https://fedoraproject.org/), então o Ansible vai usar o [dnf](https://en.wikipedia.org/wiki/DNF_(software)) que é gerenciador de pacotes padrão do Fedora. 
Mas nem todas as aplicações que uso estão disponíveis nesse gerenciador de pacotes. 

Para resolver esse problema, tive que usar a [collection](https://docs.ansible.com/ansible/latest/collections_guide/index.html) [community.general](https://galaxy.ansible.com/ui/repo/published/community/general/). 
Essa collection tem um módulo para poder instalar aplicações [Flatpak](https://diolinux.com.br/flatpak/como-utilizar-flatpaks-no-linux.html). Com isso, criei um arquivo chamado `requirements.yml` para centralizar todas as dependências. Isso deixa o processo mais simples na hora de instalar os pacotes de terceiros no Galaxy. 


**requirements.yml**

```yaml
collections:
  - name: community.general
```

Agora com esse arquivo, podemos instalar a collection:

```shell
ansible-galaxy install -r requirements.yml
```

Com a collection instala com sucesso, podemos usar o módulo para instalar aplicações Flatpak com a seguinte estrutura:

```yaml
- name: Install WaterFox          # Nome da tarefa 
  community.general.flatpak:      # Nome do módulo
	  name: net.waterfox.waterfox # ID da aplicação
	  state: present
```

Seguindo essa estrutura, definir todas as aplicações de interfaces gráficas que uso. O playbook ficou dessa forma:z

**gui.yml**

```yaml
---
- name: Installing programs with GUI
  hosts: localhost

  tasks:
    - name: Install Peek
      become: yes
      package:
        name: peek
        state: present

    - name: Install Gnome Feeds
      become: yes
      package:
        name: gnome-feeds 
        state: present

    - name: Install Gnome Tweaks
      become: yes
      package:
        name: gnome-tweaks
        state: present

    - name: Install Okular
      become: yes
      package:
        name: okular
        state: present

    - name: Install Discord
      community.general.flatpak:
        name: com.discordapp.Discord
        state: present

    - name: Install Typora
      community.general.flatpak:
        name: io.typora.Typora
        state: present

    - name: Install ONLYOFFICE
      community.general.flatpak:
        name: org.onlyoffice.desktopeditors
        state: present

    - name: Install Obsidian
      community.general.flatpak:
        name: md.obsidian.Obsidian
        state: present

    - name: Install Solanum
      community.general.flatpak:
        name: org.gnome.Solanum
        state: present

    - name: Install Planify
      community.general.flatpak:
        name: io.github.alainm23.planify
        state: present

    - name: Install WaterFox
      community.general.flatpak:
        name: net.waterfox.waterfox
        state: present

```

Para finalizar, só falta fazer a instalação das aplicações de `work`. Seguindo a mesma lógica dos outros dois playbooks, o arquivo de work ficou assim:

**work.yml**
```yaml
---
- name: Installation of work tools
  hosts: localhost

  tasks:
    - name: Install GNU/Emacs
      become: yes
      package:
        name: emacs
        state: present

    - name: Install Terminator
      become: yes
      package:
        name: terminator
        state: present

    - name: Install ZSH
      become: yes
      package:
        name: zsh
        state: present
    
    - name: Make ZSH default shell
      become: yes
      user:
        name: "{{ ansible_env.USER }}"
        shell: /bin/zsh
    
    - name: Download Oh My Zsh Installer
      get_url:
        url: "https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh"
        dest: "/tmp/install-ohmyzsh.sh"
        mode: '0755'

    - name: Install Oh My Zsh
      shell: "/bin/sh /tmp/install-ohmyzsh.sh --unattended"
      args:
        creates: "~/.oh-my-zsh"
           
    - name: Install Codium
      become: yes
      community.general.flatpak:
        name: com.vscodium.codium
        state: present
```

O [ohmyzsh](https://ohmyz.sh/) segue uma instalação totalmente diferente, para eu poder instalar, preciso fazer o download do instalador no github. Para resolver isso, tive que usar o módulo `get_url` do Ansible com 3 argumentos. 

- `url`: contem a url de onde o Ansible vai fazer o Download dos arquivos.
- `dest`: destino onde o Ansible vai salvar o instalador.
- `mode`: o `mode: 0755` vai fazer que o instalador tenha permissão de leitura e execução.

Com o instalador baixado, usei o módulo `shell` para executar o instalador (`install-ohmyzsh.sh`). Com isso, o Ansible vai poder instalar o [ohmyzsh](https://ohmyz.sh/).


Para finalizar, criei um arquivo chamado `tasks.yml` que vai importar os 3 playbooks que criei, e fazer algumas configurações para poder executar o script a partir de um único arquivo.

**tasks.yml**
```yaml
---
- hosts: localhost
  tasks:
    - name: Update dnf cache
      when: ansible_pkg_mgr == "dnf"
      ansible.builtin.dnf:
        update_cache: true
        cache_valid_time: 3600

    - name: Enable flatpak repository
      tags: repository,flatpak
      community.general.flatpak_remote:
        name: flathub
        flatpakrepo_url: "https://dl.flathub.org/repo/flathub.flatpakrepo"
        method: system
        state: present


- name: work
  import_playbook: work.yml

- name: gui
  import_playbook: gui.yml

- name: coding
  import_playbook: coding.yml

```

Veja que o script tem algumas tasks. A primeira task é responsável por fazer o update do gerenciador de pacotes do meu sistema ([dnf](https://en.wikipedia.org/wiki/DNF_(software))). O segundo é responsável por ativar o repositório do Flatpak.


**Estrutura do projeto:**

```
playbooks
├── coding.yml
├── gui.yml
├── requirements.yml
├── tasks.yml
└── work.yml
```

Agora basta executar o script com o seguinte comando:

```shell
ansible-playbook playbook/tasks.yml --ask-become-pass
```

A opção `--ask-become-pass-pass` serve para pedir a senha de `sudo` para que o Ansible execute algumas tasks como root. 

Pronto! Agora é so dixar o Ansible fazer todo o trabalho pesado e ser feliz. :)

![imagem do ansible-playbook funcionando](/assets/posts-imgs/criando-um-dotfiles/ansible-playbook-working.jpg)


## Gerenciando os dotfiles com o Dotdrop

Temos os programas instalados, mas eles ainda não estão do jeito que gosto. Temos que fazer algumas configurações para que eles estejam 100% do jeito que uso. E e ter que configurar na mão é muito demorado e chatooo. 😩

Podemos usar o [Dotdrop](https://dotdrop.readthedocs.io/en/latest/getting-started/) para poder gerenciar os nossos dotfiles (arquivos de configurações). Com ele, torna-se mais fácil do que nunca sincronizar e implantar arquivos de configuração em vários sistemas.

## Criando os DotFiles

Para poder usar o dotdrop, comecei criando um diretorio chamado `dotfiles` para poder armazenar todos os arquivos de configuração das minhas ferramentas.
A organização ficou da seguinte forma:

```
.
├── codium
│   └── extensions.txt
├── emacs
│   └── init.el
├── file-organizer
│   └── config.json
├── gnome
│   └── extensions.txt
├── obsidian
│   ├── plugins
│   └── themes
├── terminator
│   └── config
└── zsh
    └── .zshrc

```

Com os arquivos de configuração definidos, precisei configurar o dotdrop para ele poder sincronizar os arquivos em um novo sistema. Para isso, criei um arquivo chamado `config.yml` com as seguintes configurações:

```yaml
config:
  backup: true
  banner: true
  create: true
  dotpath: dotfiles
  keepdot: false
  link_dotfile_default: nolink
  link_on_import: nolink
  longkey: false
dotfiles:
  f_init.el:
    src: emacs/init.el
    dst: ~/.emacs.d/init.el
  f_config:
    src: terminator/config
    dst: ~/.config/terminator/config
  f_.zshrc:
    src: zsh/.zshrc
    dst: ~/.zshrc
  d_plugins:
    src: obsidian/plugins
    dst: ~/Documents/Obsidian Vault/.obsidian/plugins
  d_themes:
    src: obsidian/themes
    dst: ~/Documents/Obsidian Vault/.obsidian/themes


profiles:
  cleverson:
    dotfiles:
    - f_init.el
    - f_config
    - f_.zshrc
    - d_plugins
    - d_themes
```

>Não vou entrar em detalhes o que cada comando faz, para isso você pode acessar a [documentação](https://dotdrop.readthedocs.io/en/latest/) que já é rica em detalhes. Vou focar só na pate dos `dotfiles`. 

Veja que na parte `dotfiles` eu defini algumas variáveis. E essas variáveis têm o prefixo `f` que serve para representar arquivos e `d` para representar diretórios. Nas variáveis que eu definir, tem alguns argumentos, que são o `src` (caminho do arquivo) e `dst` (destino aonde o arquivo será implantado). 

Pronto, com o `config.yml` tudo configurado, podemos usar o dotdrop para que ele possa sincronizar as configurações que eu uso.


```yaml
dotdrop install --profiles=cleverson
```

![imagem da resposta do dotdrop](/assets/posts-imgs/criando-um-dotfiles/dotdrop-working.jpg)

Agora sim todos as minhas ferramentas estão configuradas. E para finalizar, só preciso instalar as extensões que eu uso no gnome.

## Automatizando as extensões do gnome.

Eu tenho algumas extensões que eu uso no [Gnome](https://www.gnome.org/) para deixar a experiência no meu sistema mais legal. Uma delas é uma extensão que traz informações de memória RAM e o uso de CPU. E uma coisa que é muito chato, é ter que procurar essas extensões e instalar manualmente. Para resolver esse problema, criei um script shell que faz esse trabalho chato para mim.

Primeiro precisamos dos IDs de cada extenção. Podemos ver quais extensões estão sendo usadas com o seguinte comando:

```shell
gnome-extensions list --enabled
```

esse comando vai mostrar uma lista de extensões que estão ativas no sistema.

![](/assets/posts-imgs/criando-um-dotfiles/gnome-extensions-list-command.jpg)

Com isso, basta salvar essas extensões em um arquivo txt. E para fazer isso, podemos usar esse comando:

```shell
gnome-extensions list --enabled > extensions.txt
```

Vou salvar esse arquivo que foi gerado na pasta **gnome** dentro do diretório [dotfiles](#criando-os-dotfiles).
Com a lista de extensões definida, falta só criar o script que vai instalar essas extensões.

**extensions_intaller.sh**
```sh
#!/bin/bash

dotfiles_dir="$PWD/dotfiles"
gnome_extensions="$dotfiles_dir/gnome/extensions.txt"

install_gnome_extensions() {
    if [ -f "$gnome_extensions" ]; then
	echo "⏳ Installing Gnome Extensions..."

	GN_CMD_OUTPUT=$(gnome-shell --version)
        GN_SHELL=${GN_CMD_OUTPUT:12:2}
        content=$(cat "$gnome_extensions")

        for ext in  $content; do
            VERSION_LIST_TAG=$(curl -Lfs "https://extensions.gnome.org/extension-query/?search=${ext}" | jq '.extensions[] | select(.uuid=="'"${ext}"'")')
            VERSION_TAG="$(echo "$VERSION_LIST_TAG" | jq '.shell_version_map |."'"${GN_SHELL}"'" | ."pk"')"
            wget -O "${ext}".zip "https://extensions.gnome.org/download-extension/${ext}.shell-extension.zip?version_tag=$VERSION_TAG"
            gnome-extensions install --force "${ext}".zip
            rm ${ext}.zip
	done
    else
        echo "Gnome extensions file not found! 🥲"
    fi
}


install_gnome_extensions


echo "🎉 Settings applied successfully!🎉"
```

Massa! Agora basta dar permissão e executar o script que ele vai fazer todo o trabalho.

```shell
chmod +x extensions_intaller.sh
./extensions_intaller.sh
```

## Conclusão

**Show 🎉** Com esse script, agora consigo configurar minha máquina rapidamente sem muito esforço. Só executar o script e esperar alguns minutos e vai estar tudo configurado do jeito que eu gosto. 
Você pode acessar o meu [repositório](https://github.com/thisiscleverson/dotfiles) e ver com mais detalhes o meu Dotfiles.
