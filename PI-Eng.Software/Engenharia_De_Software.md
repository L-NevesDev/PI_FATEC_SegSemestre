# 1. O primeiro passo para o relatório é transformar a conversa em um escopo técnico.

## Problema:
- O escritório atende 110 clientes e gasta muito tempo em conferências manuais de notas e geração de guias (INSS, FGTS, DAS), com riscos de perda de prazos e falhas de comunicação.
## Solução Proposta:
- Um sistema de gestão contábil focado na automação do fluxo fiscal/DP, com integração de dados, alertas automáticos e controle de permissões por perfil.
---
# 2. Elicitação de Requisitos
> No seu relatório, você deve separar o que o sistema faz (Funcionais) de como ele deve ser (Não Funcionais).

## Requisitos Funcionais (RF):
- RF01 - Captura de Notas: O sistema deve importar notas fiscais (emitidas, canceladas e substituídas). 
<br>
- RF02 - Cálculo de Impostos: O sistema deve calcular impostos devidos e retidos automaticamente.
<br>
- RF03 - Gestão de DP: O sistema deve processar folha de pagamento e pró-labore.
<br>
- RF04 - Alertas: O sistema deve emitir notificações de vencimento de impostos e certificados digitais (conforme o item 13 da entrevista).
<br>
- RF05 - Controle de Acesso: O sistema deve restringir acesso por cargo (Estagiário, Fiscal, RH, Sócios).

## Requisitos Não Funcionais (RNF):
- RNF01 - Segurança/LGPD: O sistema deve manter logs de alteração e backup automático.
<br> 
- RNF02 - Disponibilidade: Por ser um serviço crítico, deve estar acessível em nuvem.
<br>
- RNF03 - Legalidade: O sistema deve estar em conformidade com as normas do CFC e Receita Federal.
<br>

---

# 3. Diagrama de Casos de Uso (UML)

> Deve-se desenhar o Diagrama de Caso do projeto para o relatório

- ***Atores:*** Funcionário Fiscal, Funcionário DP, Sócio, Cliente (para receber guias).
<br>
- ***Casos de Uso Principais:*** "Importar Notas", "Gerar Guia de Imposto", "Emitir Alerta de Vencimento", "Visualizar Balancete".

> [!WARNING] ATENÇÃO
> - ***Esta parte não está completa, é necessário fazer o diagrama de caso do nosso PI. Lembrando de quem pegar esta função é necessário saber as Entradas/Saídas/Telas etc...***

---

# 4. Análise de Riscos (Segunda Fase do Modelo Cascata)

> [!WARNING] ATENÇÃO
> - ***É Necessário realizar a avaliação desta parte, lembrando que deve ser colocado na balança Risco Financeiro, Leis e Conhecimento técnico.***
> - ***Quem Ficar responsável avalie outros possíveis riscos***

---

# 5. Próximos passos (Commits neste .md)

- **Modelagem de Dados (Sistemas de Informação):** Olhando a entrevista, você precisará de tabelas para Clientes, Impostos, Documentos, Usuários (com níveis de permissão) e Logs. Como você imagina essa estrutura de tabelas?
<br>
- **Arquitetura da API (Linguagem de Programação):** Como o foco é Fiscal e DP, que tal começarmos o CRUD pela entidade "Cliente" e "Imposto"? Isso permitirá que o sistema já comece a listar quem deve pagar o quê.
<br>
- **Inglês II:** Lembre-se que a introdução do seu relatório e da fala precisa ser em inglês. Podemos começar a traduzir a "Justificativa" (Justification) do projeto?

---

> [!NOTE] Comentário (Lucas Neves Fregnani)
> - Este contúdo foi gerado por I.A e 'Corrigido' por mim, com o breve conhecimento que tenho **TODOS OS MEMBROS DO GRUPO** devem ler, entender e avaliar se isto está coerente.
> - Este arquivo vai ser usado para realização do relatório e documentação do projeto

---

> [!TIP] Dica (Lucas Neves Fregnani)
> Entre neste link [Sintaxe_Base_Markdown](https://docs.github.com/pt/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) e aprenda a formatar um arquivo markdown, tanto para editar este arquivo quanto para editar nosso 'README.md' do projeto

---

