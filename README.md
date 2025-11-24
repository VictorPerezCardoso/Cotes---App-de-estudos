📘 COTES – Controle de Tempo e Estudo

Aplicação SPA criada com React, TypeScript e integração com Google Gemini, focada em produtividade, gamificação e análise de estudos.

📌 Resumo do Projeto

O COTES é um aplicativo que ajuda estudantes a organizarem seus estudos por meio de:

Sessões cronometradas

Recursos de aprendizagem gerados via IA

Quizzes automáticos baseados no conteúdo estudado

Visualização de desempenho com gráficos

Histórico completo de sessões

Gamificação com feedback imediato e confetes

O app usa LocalStorage, funciona 100% no navegador e pode ser hospedado de forma estática.

🚀 Tecnologias Utilizadas

React 18+

TypeScript 5+

Vite 5+

Tailwind CSS 3+ (via CDN)

Recharts

Google Gemini API (@google/genai)

Web Speech API (TTS)

LocalStorage

CSS Animations

VLibras – Acessibilidade

📂 Estrutura Geral do Projeto
/src
  /components
    Header.tsx
    Auth.tsx
    LearningHub.tsx
    Quiz.tsx
    Confetti.tsx
    Dashboard.tsx
    KnowledgeBase.tsx
  /services
    geminiService.ts
  types.ts
  App.tsx
index.html
DOCUMENTACAO.md

🧠 Principais Funcionalidades
✔ 1. Autenticação Simples

Cadastro e login

Dados salvos no LocalStorage

Interface com glassmorphism + dark mode

✔ 2. Learning Hub

Cronômetro de estudo com pausa/retomada

Busca de recursos educacionais via Google Gemini + googleSearch tool

Leitura em voz alta usando Web Speech API

Salvamento automático da sessão

✔ 3. Quizzes Gerados com IA

Perguntas baseadas no conteúdo encontrado

Feedback instantâneo (certo/errado)

Leitura das questões em áudio

Mensagem motivacional

Efeito de confetti quando o desempenho é alto

✔ 4. Dashboard Analítico

Criado com Recharts:

Pizza (PieChart) → distribuição por tópicos

Barras (BarChart) → desempenho por dia

Filtros: 7 dias, 30 dias, completo

Visual escuro com cores vibrantes

✔ 5. Knowledge Base (Histórico)

Lista de todas as sessões anteriores

Dados persistidos no LocalStorage

Botão “Agendar Revisão”

Abre um link pré-preenchido no Google Calendar para o dia seguinte

🤖 Integração com IA (Gemini)

O arquivo geminiService.ts utiliza:

SDK @google/genai

Função getLearningResources(topic)

Função generateQuiz(topic, resources)

Sistemas para tratar respostas mal formatadas em Markdown

Fallback automático para garantir retorno em JSON

🛠️ Como Rodar o Projeto
1. Instalar Dependências
npm install

2. Executar em ambiente de desenvolvimento
npm run dev

3. Acessar

Abra no navegador:

http://localhost:5173

4. Build
npm run build

5. Deploy

Pode ser hospedado facilmente em:

Vercel

Netlify

GitHub Pages

Firebase Hosting

🔑 Configuração da API Gemini

Crie o arquivo:

.env


E adicione:

VITE_GEMINI_API_KEY=YOUR_KEY_HERE


Nunca commit sua chave da API no repositório público.

♿ Acessibilidade

Widget VLibras ativado no index.html

Dark mode padrão

Texto legível e contraste ajustado

Áudio para leitura de perguntas e recursos

🎨 Design

O design combina:

Dark mode

Glassmorphism

Cores vibrantes nos gráficos

Layout responsivo

UI limpa e moderna

📄 Documentação Completa

O arquivo DOCUMENTACAO.md contém:

Requisitos funcionais

Requisitos não funcionais

Arquitetura

Estrutura do projeto

Fluxos e comportamentos do sistema

🤝 Contribuições

Contribuições, issues e sugestões são sempre bem-vindas!
Fique à vontade para abrir um Pull Request.

📜 Licença

Este projeto está sob a licença MIT.
Você pode usar, modificar e distribuir conforme desejar.






<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BaGzKr7O6sPVqYmT9C1UTDda4BFaTsDv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
