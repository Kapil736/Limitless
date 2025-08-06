# Limitless: An Agentic AI Development Environment

<p align="center">
  <img src="C:\Users\nicks\Limitless\limitless\landing_page.png" alt="Limitless Banner" width="600"/>
</p>

<p align="center">
  A GenAI-powered local IDE that transforms high-level user prompts into complete, multi-file codebases. Limitless uses a multi-agent workflow to first plan a project's architecture and then execute that plan by writing the code.
</p>

---

<p align="center">
  <img src="C:\Users\nicks\Limitless\limitless\ChatUI_page.png" alt="Limitless Banner" width="600"/>
</p>

## 🤖 About The Project

Limitless is a "work in progress" exploration into the future of AI-native software development. It moves beyond simple chat-based code generation by implementing a structured, multi-step agentic system designed to mimic a real-world software team.

The core of Limitless is its **two-agent "Plan and Execute" system**:

1.  **The Architect (PRD Agent):** A general-purpose LLM (like `Mistral`) that acts as a product manager. It takes a user's initial idea and generates a structured **Project Requirements Document (PRD)** in JSON format, outlining the project's features and tech stack.
2.  **The Builder (Code Agent):** A specialized code model (like `Qwen-Code`) that takes the PRD created by the Architect as its "source of truth." It then generates a complete, multi-file codebase and structures it in a logical file hierarchy, writing the files directly to the local file system.

## ✅ Current Features

* **Multi-Agent Backend:** Orchestrates a two-step workflow using different, specialized local LLMs via Ollama.
* **File System Integration:** The agent has the ability to create project folders and write multiple files (`.html`, `.css`, `.js`, etc.) to the local disk.
* **Componentized UI:** The frontend is built with Next.js and Tailwind CSS and includes:
    * A full project management sidebar (create, rename, delete).
    * A conversational chat interface.
    * An interactive file explorer to display the generated file structure.
    * A read-only code viewer with syntax highlighting.
* **State Persistence:** User-created projects and chat histories are saved to the browser's `localStorage`.

## 🛠️ Built With

This project is built with a modern, local-first AI stack.

* **Frontend:**
    * [Next.js](https://nextjs.org/)
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
* **Backend:**
    * [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (Node.js Runtime)
* **AI & ML:**
    * [Ollama](https://ollama.com/)
    * [Mistral](https://mistral.ai/) (for PRD Agent)
    * [Qwen-Code](https://github.com/QwenLM/Qwen1.5) (for Code Agent)
    * Prompt Engineering

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have the following software installed:
* [Node.js](https://nodejs.org/en) (v18 or later)
* [Ollama](https://ollama.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone {YOUR_REPOSITORY_URL}
    cd limitless
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Download the AI Models:**
    Open your terminal and pull the required models using Ollama.
    ```sh
    ollama pull mistral
    ollama pull qwen:7b-code 
    ```
    *(Note: The exact tag for the Qwen code model may vary. Use the one you have installed.)*

### Running the Application

You will need to run two processes in two separate terminals.

1.  **Terminal 1: Start the Next.js App**
    ```sh
    npm run dev
    ```
    Your app will be available at `http://localhost:3000`.

2.  **Terminal 2: Run an Ollama Model**
    To ensure the models are loaded and ready, you can run one in the terminal (Ollama will keep it active for API calls).
    ```sh
    ollama run mistral
    ```

## 🗺️ Roadmap

The next phase of development focuses on transforming Limitless from a read-only IDE into a fully interactive environment.

-   [ ] **In-App Code Editing:**
    -   [ ] Replace the code viewer with the Monaco Editor.
    -   [ ] Implement a "Save" feature to write user changes back to the file system.
-   [ ] **Live Project Previews:**
    -   [ ] Add a "Run" button to the UI.
    -   [ ] Serve the generated project's static files in a sandboxed `<iframe>`.
-   [ ] **The Debugging & Iteration Agent:**
    -   [ ] Develop an agent that can analyze error messages or user feedback.
    * [ ] Enable the agent to read existing code and apply fixes.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

[cite_start]Kapil R Kaushik - kapilkaushik073@gmail.com [cite: 133]

Project Link: {YOUR_REPOSITORY_URL}