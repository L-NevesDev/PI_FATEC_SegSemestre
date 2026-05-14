# 📚 Projeto Interdisciplinar — Guia de Configuração do Repositório

> Leia este guia **completamente** antes de começar a trabalhar no projeto.

---

## ⚠️ AVISO IMPORTANTE

> **A branch `main` é exclusiva para o projeto finalizado.**
>
> **NÃO** faça commits diretamente na `main`.
> Cada membro do grupo **deve criar sua própria branch** com seu nome antes de começar a desenvolver qualquer funcionalidade ou alteração.
> Todo o desenvolvimento deve acontecer na branch individual. A `main` só receberá o código quando o projeto estiver concluído e aprovado por todos do grupo.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Git](https://git-scm.com/downloads)
- Um editor de código (ex: [VS Code](https://code.visualstudio.com/))
- Conta no GitHub com acesso ao repositório do grupo

Para verificar se o Git está instalado, abra o terminal e execute:

```bash
git --version
```

---

## 🔗 Passo 1 — Clonar o Repositório Remoto

Clone o repositório para a sua máquina local. Substitua `<URL_DO_REPOSITORIO>` pela URL real do repositório do grupo (disponível no GitHub, botão verde **"Code"**).

```bash
git clone <URL_DO_REPOSITORIO>
```

**Exemplo:**

```bash
git clone https://github.com/seu-grupo/projeto-interdisciplinar.git
```

Após o clone, entre na pasta do projeto:

```bash
cd projeto-interdisciplinar
```

---

## ⚙️ Passo 2 — Configurar seu Usuário Git (se ainda não configurou)

Antes de fazer qualquer commit, configure seu nome e e-mail (use os mesmos da sua conta GitHub):

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email@exemplo.com"
```

---

## 🌿 Passo 3 — Criar sua Branch Pessoal

Cada membro do grupo **obrigatoriamente** deve criar uma branch com seu próprio nome. Isso garante que o trabalho de cada pessoa fique separado e organizado.

```bash
git checkout -b nome-do-membro
```

**Exemplos:**

```bash
git checkout -b joao-silva
git checkout -b maria-oliveira
git checkout -b pedro-souza
```

> 💡 Use letras minúsculas e hífens no lugar de espaços. Evite acentos e caracteres especiais.

Para confirmar em qual branch você está:

```bash
git branch
```

A branch com `*` na frente é a branch ativa no momento.

---

## 📤 Passo 4 — Publicar sua Branch no Repositório Remoto

Após criar sua branch local, publique-a no GitHub para que os demais membros do grupo possam visualizá-la:

```bash
git push -u origin nome-do-membro
```

**Exemplo:**

```bash
git push -u origin joao-silva
```

> O `-u` configura o rastreamento automático. Nos próximos pushes, basta usar `git push`.

---

## 💻 Passo 5 — Fluxo de Trabalho do Dia a Dia

Sempre que for trabalhar no projeto, siga este fluxo:

**1. Certifique-se de estar na sua branch:**

```bash
git checkout nome-do-membro
```

**2. Atualize sua branch com as mudanças da `main` (faça isso regularmente):**

```bash
git pull origin main
```

**3. Faça suas alterações nos arquivos normalmente.**

**4. Adicione os arquivos alterados ao stage:**

```bash
# Adicionar todos os arquivos modificados
git add .

# Ou adicionar um arquivo específico
git add nome-do-arquivo.ext
```

**5. Faça o commit com uma mensagem descritiva:**

```bash
git commit -m "Descrição clara do que foi feito"
```

**Exemplos de boas mensagens de commit:**

```bash
git commit -m "Adiciona tela de login"
git commit -m "Corrige bug no cálculo de notas"
git commit -m "Atualiza documentação da função principal"
```

**6. Envie suas alterações para o GitHub:**

```bash
git push
```

---

## 🔄 Passo 6 — Sincronizar com o Código Base da `main`

Caso novos arquivos ou atualizações sejam adicionados à `main` (ex: código base inicial do projeto), siga os passos abaixo para trazer essas mudanças para sua branch:

```bash
# 1. Certifique-se de estar na sua branch
git checkout nome-do-membro

# 2. Busque as atualizações remotas
git fetch origin

# 3. Integre as mudanças da main na sua branch
git merge origin/main
```

Se houver conflitos, o Git indicará os arquivos. Resolva os conflitos, salve os arquivos e então:

```bash
git add .
git commit -m "Resolve conflitos com a main"
```

---

## 🚀 Push do Código Base da `main`

> Esta seção é destinada ao **responsável pelo repositório** (quem criou e gerencia a `main`).

Para enviar o código base inicial para a branch `main`:

```bash
# 1. Certifique-se de estar na branch main
git checkout main

# 2. Adicione todos os arquivos do projeto
git add .

# 3. Faça o commit inicial
git commit -m "Adiciona código base inicial do projeto"

# 4. Envie para o repositório remoto
git push origin main
```

---

## 📌 Resumo dos Comandos Principais

| Ação | Comando |
|---|---|
| Clonar repositório | `git clone <URL>` |
| Ver branch atual | `git branch` |
| Criar e mudar de branch | `git checkout -b nome-branch` |
| Mudar para uma branch existente | `git checkout nome-branch` |
| Atualizar com a main | `git pull origin main` |
| Adicionar arquivos ao stage | `git add .` |
| Fazer commit | `git commit -m "mensagem"` |
| Enviar para o GitHub | `git push` |
| Publicar branch nova | `git push -u origin nome-branch` |

---

## ❓ Dúvidas Frequentes

**Posso fazer commit direto na `main`?**
Não. A `main` é reservada para a versão final do projeto. Todo desenvolvimento deve ser feito na sua branch pessoal.

**Perdi minha branch local, e agora?**
Se a branch já foi publicada no GitHub, recupere-a com:
```bash
git checkout -b nome-do-membro origin/nome-do-membro
```

**Como ver todas as branches do projeto?**
```bash
git branch -a
```

---

*Em caso de dúvidas, entre em contato com o responsável pelo repositório do grupo.*
