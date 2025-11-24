# COTES – Controle de Tempo e Estudo

## Descrição do Projeto
O COTES é uma aplicação web Single Page Application (SPA) focada em produtividade e aprendizado. Ela auxilia estudantes a gerenciar sessões de estudo, encontrar materiais relevantes automaticamente via Inteligência Artificial, testar conhecimentos através de quizzes gerados dinamicamente e acompanhar o progresso através de gráficos estatísticos.

## Requisitos Funcionais
1.  **Autenticação:** Cadastro e Login de usuários (armazenamento local).
2.  **Learning Hub:**
    *   Definição de tópicos de estudo.
    *   Cronômetro de foco (Start/Pause/Stop).
    *   Busca automática de referências bibliográficas via IA (Google Search Grounding).
    *   Leitura de texto (Text-to-Speech) dos recursos encontrados.
3.  **Quiz Gamificado:**
    *   Geração automática de perguntas baseadas no tópico estudado.
    *   Feedback imediato.
    *   Pontuação e efeitos visuais (Confetti).
4.  **Dashboard (Analytics):**
    *   Gráficos de distribuição de tempo por assunto.
    *   Histórico de desempenho diário.
5.  **Knowledge Base (Histórico):**
    *   Listagem de sessões passadas.
    *   Integração com Google Calendar para agendar revisões.

## Requisitos Não Funcionais
*   **Performance:** Carregamento rápido e transições suaves.
*   **Persistência:** Todos os dados persistidos em `localStorage`.
*   **Interface:** Design moderno "Glassmorphism" com modo Dark padrão.
*   **Acessibilidade:** Widget VLibras e contrastes adequados.

## Arquitetura Sugerida
*   **Frontend:** React 18 com TypeScript.
*   **Estilização:** Tailwind CSS.
*   **State Management:** React Context ou State Lift (App.tsx como orquestrador).
*   **AI Service:** Camada de serviço isolada para comunicação com Google Gemini API.
*   **Data Layer:** Abstração simples sobre `localStorage`.

## Fluxo Geral do Usuário
1.  **Auth:** Usuário faz login/cadastro.
2.  **Hub:** Usuário digita um tema e inicia o cronômetro. A IA sugere materiais.
3.  **Estudo:** Usuário consome o conteúdo. Ao finalizar, o tempo é salvo.
4.  **Quiz:** O sistema gera perguntas sobre o tema para fixação.
5.  **Dashboard:** O usuário visualiza seu progresso acumulado.

## Tecnologias
*   React 18+
*   TypeScript 5+
*   Vite
*   Tailwind CSS 3+
*   Google GenAI SDK (@google/genai)
*   Recharts (Visualização de dados)
*   Lucide React (Ícones)
