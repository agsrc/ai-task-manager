# TaskArchitect: AI-Powered Workflow Engine
TaskArchitect is a high-performance, full-stack task management system built with Quarkus (Java 25) and React 19. It transitions from a standard CRUD application into an intelligent agentic tool, utilizing AI to parse unstructured data into actionable work items.

## 🚀 Key Features
### Intelligent Dual-Entry System:

1. Manual Mode: Full granular control over title, description, and priority (P1-P5).

2. AI Brain Dump: Paste meeting notes, emails, or raw thoughts. The system uses LLMs to extract and categorize multiple tasks at once.

3. Performance Telemetry: Real-time "Last Sync" monitoring that tracks the Round-Trip Time (RTT) of API calls, providing transparent network latency feedback.

### Dynamic Task Board:

- Priority-First Sorting: Active tasks are sorted by severity.

- Auto-Sinking Completion: Marking a task as complete triggers a "strike-through" and moves it to the bottom of the stack to clear your focus.

- Rich Task Modals: Expandable details with backdrop-blur effects and dedicated status controls.

- Responsive Feedback: Interactive toast notifications for every action (Success/Green for creation, Warning/Red for deletion).

## 🛠️ Technology Stack
### Backend

Framework: Quarkus (RESTEasy Reactive)

Persistence: Hibernate Panache with H2 Database

AI Orchestration: LangChain4j (integrating LLM parsing logic)

Language: Java 25

### Frontend
Framework: React 19 (TypeScript)

Styling: Tailwind CSS

State Management: React Hooks (useState, useEffect)

Animations: Tailwind CSS Animate & Framer-like transitions

Icons & Feedback: Lucide-React & React-Hot-Toast

## 💻 Setup & Installation
Prerequisites
JDK 25+
Node.js 18+
Maven

1. Backend Setup (Quarkus)

### From the root directory
- `mvn quarkus:dev`

The API will be available at http://localhost:8080. You can access the Quarkus Dev UI at /q/dev to monitor Hibernate transactions and REST endpoints.

2. Frontend Setup (Vite + React)

### Navigate to the UI directory
- `cd webui`

### Install dependencies
- `npm install`

## Start the development server
- `npm run dev`
The UI will run on http://localhost:5173.

**Note: The Vite configuration is set up to proxy API calls to the Quarkus backend to avoid CORS issues during development.**

## 🏗️ Architectural Decisions
- Hibernate Dirty Checking: Utilized managed entities within @Transactional boundaries to allow automatic database synchronization without explicit .update() calls.

- Performance Interceptors: Implemented performance.now() hooks in the React fetch layer to provide immediate feedback on system responsiveness.

- Semantic UI State: Used a "mode-switching" pattern for the entry hub to keep the interface clean while supporting complex AI interactions.

- Event Propagation Control: Implemented e.stopPropagation() on interactive elements within cards to allow nested click events (toggle vs. view details).

## 📈 Potential Improvements

[ ] Integration of LangChain4j for automated priority suggestions.

[ ] Persistent time-tracking metrics per task.

[ ] Exporting tasks to Markdown/PDF for meeting summaries.