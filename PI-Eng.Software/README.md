# Sabor & Magia — Sistema de Gestão de Confeitaria

> Relatório de Engenharia de Software elaborado a partir de entrevista com os proprietários da confeitaria Sabor & Magia. Este documento cobre o levantamento de requisitos, análise de riscos, estimativa por Pontos de Função e planejamento de desenvolvimento do sistema.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Contexto da Empresa](#contexto-da-empresa)
- [Técnica de Levantamento de Requisitos](#técnica-de-levantamento-de-requisitos)
- [Mapeamento do Processo Atual (As-Is)](#mapeamento-do-processo-atual-as-is)
- [Análise PIECES](#análise-pieces)
- [Requisitos do Sistema](#requisitos-do-sistema)
  - [Requisitos Funcionais](#requisitos-funcionais)
  - [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Análise de Riscos](#análise-de-riscos)
- [Métricas — Pontos de Função](#métricas--pontos-de-função)
- [Planejamento do Projeto](#planejamento-do-projeto)
- [Plano de Testes](#plano-de-testes)
- [Ferramentas CASE](#ferramentas-case)
- [Qualidade de Software](#qualidade-de-software)
- [Manutenção e Evolução](#manutenção-e-evolução)

---

## Sobre o Projeto

Este repositório documenta o processo de **Engenharia de Software** aplicado ao desenvolvimento de um sistema de gestão para a confeitaria **Sabor & Magia**. O projeto cobre desde o levantamento de requisitos até o planejamento de manutenção, servindo como base técnica para o desenvolvimento da solução.

O sistema tem como objetivo central substituir os processos manuais da empresa (agenda física, WhatsApp, memória dos colaboradores) por uma plataforma integrada que gerencie pedidos, estoque, fichas técnicas de receitas, controle financeiro e emissão fiscal.

---

## Contexto da Empresa

A **Sabor & Magia** é uma confeitaria de pequeno porte sediada em São Paulo, operada por dois colaboradores:

| Colaborador | Função |
|---|---|
| **Leonor** | Proprietária e Confeiteira-Chefe |
| **Júnior** | Responsável pela operação logística e atendimento ao cliente |

**Perfil de clientes:** predominantemente famílias da região, com dois fluxos distintos:
- **Durante a semana:** venda de bolos simples para o café da tarde.
- **Fins de semana:** produção de bolos recheados e doces personalizados para festas e eventos sob encomenda.

---

## Técnica de Levantamento de Requisitos

### Técnica Utilizada: Entrevista

A técnica escolhida para o levantamento de requisitos foi a **Entrevista Semiestruturada**, conduzida diretamente com Leonor e Júnior. As perguntas foram organizadas em cinco blocos temáticos:

1. Visão geral e contextualização
2. Mapeamento do processo atual
3. Identificação de dores e problemas (Análise PIECES)
4. A solução desejada (To-Be)
5. Conformidade e perspectivas futuras

**Por que a Entrevista foi a técnica ideal?**

A empresa conta com apenas dois colaboradores que detêm conhecimento total sobre o negócio. A entrevista permitiu extrair informações diretamente da fonte, com a possibilidade de aprofundar respostas em tempo real — como ocorreu ao identificar o problema de desalinhamento entre produção e entrega, um detalhe que dificilmente seria capturado por uma técnica menos interativa.

---

### Por que as outras técnicas não foram utilizadas

| Técnica | Motivo da Não Aplicação |
|---|---|
| **Questionário / Survey** | Útil para muitos usuários distribuídos. Com apenas dois colaboradores no mesmo local, seria impessoal e menos eficiente que uma conversa direta. |
| **Observação** | Exigiria acompanhar o dia a dia por dias ou semanas, especialmente nos fins de semana de pico. Alto custo de tempo, desnecessário pois os proprietários conseguem articular bem seus problemas. |
| **Prototipação** | Indicada quando o usuário não consegue descrever o que precisa sem ver algo concreto. Leonor e Júnior foram específicos sobre suas necessidades (ficha técnica integrada ao estoque, alertas via WhatsApp, perfis de acesso), eliminando essa barreira. |
| **JAD (Joint Application Design)** | Adequado para projetos com múltiplos stakeholders em conflito que precisam chegar a consenso. Para dois usuários de uma microempresa, seria burocrático e desnecessário. |
| **Análise de Documentos** | Pressupõe a existência de documentos formais (planilhas, relatórios, manuais). A Sabor & Magia opera de forma inteiramente informal, sem nenhum registro estruturado. |

---

## Mapeamento do Processo Atual (As-Is)

Toda a operação é sustentada por ferramentas informais, conforme identificado na entrevista:

- **Recebimento de Pedidos:** via WhatsApp e atendimento presencial no portão, sem registro centralizado.
- **Controle de Prazos:** agenda física com alta dependência de memória, tornando-se caótica em semanas de alta demanda.
- **Cadastro de Clientes:** inexistente em sistema. Apenas o contato salvo no celular com o nome da pessoa. Informações críticas (restrições alimentares, tema, status do sinal pago) são transmitidas informalmente com alto risco de perda.
- **Controle de Produção:** sem visibilidade de status entre os colaboradores. Júnior desconhece em qual etapa Leonor está na cozinha, comprometendo a precisão das informações ao cliente.

---

## Análise PIECES

A análise PIECES identifica problemas no sistema atual em seis dimensões:

| Dimensão | Problema Identificado | Impacto |
|---|---|---|
| **Performance** | Controle manual via WhatsApp e agenda gera lentidão e atrasos | Alto |
| **Information** | Perda de dados críticos: restrições alimentares, sinais pagos, detalhes do pedido | Alto |
| **Economy** | Precificação desatualizada e desperdício de insumos comprometem a margem de lucro | Alto |
| **Control** | Sem rastreamento do status de produção; ausência de controle de acesso a dados financeiros | Médio |
| **Efficiency** | Atendimento demorado para fechamento de encomendas; produção e entrega desalinhadas | Alto |
| **Service** | Clientes sem retorno proativo sobre o status do pedido; ausência de cadastro formal | Médio |

---

## Requisitos do Sistema

### Requisitos Funcionais

| ID | Requisito | Descrição | Prioridade |
|---|---|---|---|
| RF01 | Cadastro de Clientes | Registrar nome, WhatsApp, endereço e data de aniversário | Alta |
| RF02 | Registro de Pedidos | Registrar encomendas com sabor, recheio, cobertura, tema, data e valor | Alta |
| RF03 | Controle de Estoque | Monitorar entradas/saídas de insumos; alertar ao atingir estoque mínimo | Alta |
| RF04 | Ficha Técnica de Receitas | Vincular receitas aos insumos do estoque; calcular custo real por bolo | Alta |
| RF05 | Controle Financeiro | Registrar entradas e saídas; gerar fluxo de caixa | Alta |
| RF06 | Status de Produção | Rastrear etapas do pedido: aguardando → em produção → pronto → entregue | Alta |
| RF07 | Relatórios Gerenciais | Relatórios de vendas, sabores mais vendidos e margem de lucro por produto | Média |
| RF08 | Notificações Automáticas | Alertas ao cliente via WhatsApp ("bolo em produção", "saiu para entrega") | Média |
| RF09 | Emissão de NFC-e | Emitir Nota Fiscal de Consumidor eletrônica conforme legislação estadual | Alta |
| RF10 | Controle de Acesso | Perfis: Proprietário (acesso total) e Entregador (acesso básico) | Alta |
| RF11 | Orçamento para CNPJ | Gerar orçamentos para clientes corporativos e buffets | Baixa |

### Requisitos Não Funcionais

- **Usabilidade:** Interface intuitiva para usuários sem formação técnica, acessível via computador ou tablet.
- **Segurança:** Controle de acesso por perfil; senhas com hash seguro (bcrypt); conformidade com a LGPD.
- **Conformidade:** Aderente à LGPD, às normas da Vigilância Sanitária (rastreabilidade de validade de insumos) e à legislação de NFC-e estadual.
- **Desempenho:** Tempo de resposta inferior a 3 segundos para operações comuns.
- **Escalabilidade:** Arquitetura preparada para expansão a atendimento corporativo e faturamento para CNPJ.
- **Disponibilidade:** Backup automático diário em nuvem; meta de disponibilidade superior a 99% no horário de operação.

---

## Análise de Riscos

| ID | Risco | Impacto | Probabilidade | Nível | Mitigação |
|---|---|---|---|---|---|
| R01 | Resistência dos proprietários ao uso de tecnologia | Médio | Alta | Alta | Treinamento progressivo e interface simplificada |
| R02 | Perda de dados por falha no dispositivo (sem backup) | Alto | Média | Alta | Backup automático em nuvem |
| R03 | Custo de insumos não atualizado no sistema | Alto | Alta | Crítico | Alerta automático de revisão de preço de custo |
| R04 | Mudança na legislação da NFC-e | Médio | Baixa | Médio | Parametrização flexível conforme SEFAZ estadual |
| R05 | Crescimento da demanda antes da implantação | Alto | Média | Alto | Priorizar módulos de pedido e estoque no MVP |
| R06 | Acesso indevido a dados financeiros por terceiros | Alto | Baixa | Médio | Controle de perfil de acesso (Proprietário / Entregador) |

---

## Métricas — Pontos de Função

A estimativa de tamanho foi realizada pela **Análise por Pontos de Função (APF)**, técnica independente de tecnologia que mede o software pelo que ele faz, não por como é feito.

### Contagem Bruta (PFNA)

| Função | Tipo | Complexidade | PF |
|---|---|---|---|
| ALI – Clientes | Arquivo Lógico Interno | Simples | 7 |
| ALI – Pedidos/Encomendas | Arquivo Lógico Interno | Médio | 10 |
| ALI – Estoque (Insumos) | Arquivo Lógico Interno | Simples | 7 |
| ALI – Fichas Técnicas | Arquivo Lógico Interno | Médio | 10 |
| ALI – Financeiro/Caixa | Arquivo Lógico Interno | Simples | 7 |
| AIE – NFC-e (SEFAZ) | Arquivo Interface Externa | Simples | 5 |
| EE – Cadastro de Pedido | Entrada Externa | Simples | 3 |
| EE – Cadastro de Cliente | Entrada Externa | Simples | 3 |
| EE – Entrada de Estoque | Entrada Externa | Simples | 3 |
| EE – Atualização de Custo | Entrada Externa | Simples | 3 |
| SE – Orçamento de Encomenda | Saída Externa | Médio | 5 |
| SE – Relatório de Vendas | Saída Externa | Médio | 5 |
| SE – Alerta de Estoque Mínimo | Saída Externa | Simples | 4 |
| CE – Status do Pedido | Consulta Externa | Simples | 3 |
| CE – Histórico do Cliente | Consulta Externa | Simples | 3 |
| **TOTAL PFNA** | | | **78** |

### Fator de Ajuste (QIG)

Soma Total do Questionário de Influência Geral: **TDI = 34**

### Cálculo Final

```
PFA = PFNA × (0,65 + 0,01 × TDI)
PFA = 78 × (0,65 + 0,01 × 34)
PFA = 78 × 0,99
PFA ≈ 77 Pontos de Função Ajustados
```

> Sistema de **porte pequeno a médio**, estimado para desenvolvimento em **12 a 16 semanas** com uma equipe de 2 a 3 desenvolvedores.

---

## Planejamento do Projeto

| # | Fase | Duração | Período | Status |
|---|---|---|---|---|
| 1 | Levantamento de Requisitos | 2 sem | Sem. 1–2 | Concluída |
| 2 | Análise e Modelagem do Sistema | 2 sem | Sem. 3–4 | Em andamento |
| 3 | Projeto de Banco de Dados | 1 sem | Sem. 5 | Pendente |
| 4 | Desenvolvimento – Módulo Core | 4 sem | Sem. 6–9 | Pendente |
| 5 | Desenvolvimento – Módulo Fiscal | 2 sem | Sem. 10–11 | Pendente |
| 6 | Testes Unitários e Integração | 2 sem | Sem. 12–13 | Pendente |
| 7 | Homologação com Usuários | 1 sem | Sem. 14 | Pendente |
| 8 | Implantação e Treinamento | 1 sem | Sem. 15 | Pendente |
| 9 | Manutenção Pós-implantação | Contínua | Sem. 16+ | Pendente |

---

## Plano de Testes

| ID | Caso de Teste | Tipo |
|---|---|---|
| T01 | Cadastro de cliente sem WhatsApp deve ser bloqueado | Funcional |
| T02 | Alerta gerado ao reduzir insumo abaixo do mínimo | Funcional |
| T03 | Custo calculado e estoque abatido ao registrar pedido com receita | Funcional |
| T04 | Perfil Entregador não acessa relatórios financeiros | Segurança |
| T05 | NFC-e transmitida com sucesso à SEFAZ ao finalizar venda | Integração |
| T06 | Tempo de resposta < 3s com 20 pedidos simultâneos | Desempenho |
| T07 | Mensagem WhatsApp enviada ao alterar status para "saiu para entrega" | Funcional |
| T08 | Relatório mensal gerado com sabores, receita e margem de lucro | Funcional |

**Estratégia:**
- **Testes Unitários** — por módulo, realizados pelos desenvolvedores.
- **Testes de Integração** — validação da comunicação entre módulos (ex.: pedido → estoque → ficha técnica).
- **UAT (User Acceptance Testing)** — conduzido com Leonor e Júnior no ambiente de homologação.
- **Testes de Regressão** — executados após qualquer correção.

---

## Ferramentas CASE

| Categoria | Ferramentas |
|---|---|
| **Modelagem e Análise** | Astah Community, draw.io, BRModelo |
| **Desenvolvimento** | VS Code / IntelliJ IDEA, Git + GitHub |
| **Gestão de Projeto** | Microsoft Project / ProjectLibre, Trello ou Jira |
| **Qualidade e Testes** | Postman (APIs), JUnit / Pytest (testes automatizados) |

---

## Qualidade de Software

O plano de qualidade é fundamentado na norma **ISO/IEC 25010 (SQuaRE)**:

- **Adequação Funcional:** cobertura total dos processos mapeados (pedidos, estoque, financeiro, fiscal).
- **Usabilidade:** testes com os próprios colaboradores; meta de execução das operações principais sem auxílio externo.
- **Segurança:** controle de acesso por perfil, senhas com hash bcrypt, conformidade com a LGPD.
- **Confiabilidade:** backup automático diário; disponibilidade > 99% no horário de operação.
- **Rastreabilidade de Insumos:** registro de validade e lotes para conformidade com a Vigilância Sanitária.

---

## Manutenção e Evolução

| Tipo | Descrição |
|---|---|
| **Corretiva** | Correção de defeitos pós-implantação. SLA: 24h para bugs críticos, 72h para não críticos. |
| **Adaptativa** | Ajustes por mudanças externas, principalmente na legislação da NFC-e e na tabela de alíquotas estaduais. |
| **Perfectiva** | Módulo de orçamento corporativo, faturamento para CNPJ (NFS-e/NF-e) e integração com entrega terceirizada. |
| **Preventiva** | Atualização de dependências, limpeza de banco de dados e auditorias semestrais de segurança. |

---

## 📄 Documentação Completa

O relatório técnico completo está disponível aqui no repositório

---