# 🎂 Sistema de Gestão — Sabor e Magia: Bolos e Doces

> Repositório contendo o relatório e a documentação técnica desenvolvidos na disciplina de **Engenharia de Software**, com foco no levantamento de requisitos, análise de viabilidade e planejamento de um sistema de gestão para a confeitaria **Sabor e Magia – Bolos e Doces**.

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura do Relatório](#estrutura-do-relatório)
- [Levantamento de Requisitos](#levantamento-de-requisitos)
- [Análise de Riscos](#análise-de-riscos)
- [Métricas — Ponto de Função](#métricas--ponto-de-função)
- [Ferramentas CASE](#ferramentas-case)
- [Cronograma](#cronograma)
- [Tecnologias e Ferramentas](#tecnologias-e-ferramentas)
- [Equipe](#equipe)

---

## 📌 Sobre o Projeto

A **Sabor e Magia – Bolos e Doces** é uma empresa do setor alimentício que atua com encomendas e vendas de bolos e doces a pronta entrega. Antes do projeto, todos os processos eram realizados manualmente: pedidos anotados em agenda e comunicações feitas via WhatsApp e Instagram, gerando perdas de informação e ineficiência operacional.

O objetivo deste trabalho é documentar o processo de engenharia de software aplicado ao desenvolvimento de um **sistema de gestão de pedidos, clientes e estoque** para a empresa, cobrindo desde a elicitação de requisitos até o planejamento e métricas do projeto.

---

## 📂 Estrutura do Relatório

```
📄 RELATÓRIO.docx
├── 1. Engenharia de Software
│   ├── 1.1 Introdução
│   ├── 1.2 Ata da Entrevista
│   ├── 1.3 Análise de Riscos
│   │   ├── 1.3.1 Tempo
│   │   ├── 1.3.2 Leis
│   │   └── 1.3.3 Desconhecimento Técnico
│   ├── 1.4 Cálculo de Ponto de Função
│   │   ├── 1.4.1 Entradas Externas
│   │   ├── 1.4.2 Saídas Externas
│   │   ├── 1.4.3 Consultas Externas
│   │   ├── 1.4.4 Arquivos Lógicos Internos
│   │   ├── 1.4.5 Arquivos de Interface Externa
│   │   └── 1.4.6 Cálculo dos Pontos de Função
│   ├── 1.5 Questionário de Influência Geral
│   ├── 1.6 Cálculo Final
│   ├── 1.7 Cronograma de Atividades
│   └── 1.8 Ferramentas CASE
```

---

## 🔍 Levantamento de Requisitos

As técnicas utilizadas para o levantamento de requisitos foram:

- **Entrevista** — Realizada com Leonor (Dona/Gerente) e José (Operacional/Administrativo), identificando os principais pontos de dor da empresa.
- **Brainstorm** — Utilizado pelo grupo para propor soluções livres, sem se prender a padrões técnicos rígidos.

> Técnicas como JAD e PIECES foram descartadas, pois exigem que os colaboradores já tenham um nível de conhecimento técnico prévio, o que não era o caso da equipe da confeitaria.

### Principais funcionalidades identificadas

| Funcionalidade | Descrição |
|---|---|
| Login de colaborador | Acesso via credenciais criadas pelo root |
| Cadastro de cliente/pedido | Nome, produto, recheio, cobertura, entrega, valor |
| Gestão de estoque | Cadastro com data de produção, validade e quantidade |
| Delivery | Controle de endereço, valor de frete e nome do recebedor |
| Respostas automáticas *(opcional)* | Integração via API com WhatsApp/Instagram |

---

## ⚠️ Análise de Riscos

| Risco | Efeito | Mitigação |
|---|---|---|
| **Tempo** — falta de disponibilidade da equipe | Desenvolvimento lento e atrasos nas entregas | Início antecipado do projeto |
| **LGPD** — vazamento de dados pessoais dos clientes | Sanções legais e perda de confiança | Banco com acesso restrito e coleta mínima de dados |
| **CDC** — erros no cálculo de valores ou prazos | Reclamações e obrigações legais | Testes rigorosos na lógica de precificação e log imutável |
| **Desconhecimento técnico** da equipe | Retrabalho, erros e abandono do projeto | Capacitação ou terceirização do desenvolvimento |

---

## 📐 Métricas — Ponto de Função

### Contagem de Pontos de Função Brutos

| Categoria | Simples | Média | Complexa | Subtotal |
|---|---|---|---|---|
| EE — Entradas Externas | 3 × 3 = 9 | 2 × 4 = 8 | 1 × 6 = 6 | **23** |
| SE — Saídas Externas | 1 × 4 = 4 | 2 × 5 = 10 | 2 × 7 = 14 | **28** |
| CE — Consultas Externas | 3 × 3 = 9 | 2 × 4 = 8 | 0 | **17** |
| ALI — Arquivos Lógicos Internos | 2 × 7 = 14 | 2 × 10 = 20 | 1 × 15 = 15 | **49** |
| AIE — Arquivos de Interface Externa | 0 | 0 | 1 × 10 = 10 | **10** |
| | | | **TOTAL** | **127 PF** |

### Questionário de Influência Geral

Soma dos fatores de influência: **39**

### Cálculo Final

```
FP = 127 × [0,65 + 0,01 × 39]
FP = 127 × [0,65 + 0,39]
FP = 127 × 1,04
FP ≈ 132,08 Pontos de Função Ajustados
```

> O resultado indica um sistema de **complexidade levemente acima do padrão**, condizente com um sistema de gestão simples que possui integrações externas e armazenamento de dados a longo prazo.

---

## 🛠️ Ferramentas CASE

| Ferramenta | Finalidade |
|---|---|
| **Postman** | Teste das integrações com APIs externas (WhatsApp/Instagram) |
| **Gatling** | Testes de volume e estresse do banco de dados |
| **Selenium** | Testes de interface e usabilidade para usuários sem experiência técnica |

---

## 📅 Cronograma

O cronograma de atividades está documentado na seção **1.7** do relatório (`RELATÓRIO.docx`).

---

## 👥 Equipe

Trabalho desenvolvido no âmbito da disciplina de **Engenharia de Software**.

---

## 📄 Licença

Este repositório é de uso acadêmico. Todos os direitos reservados aos autores do trabalho.
