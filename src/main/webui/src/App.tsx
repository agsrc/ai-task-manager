import { useState, useEffect } from 'react';
import { TaskItem } from './components/TaskItem';
import { Toaster, toast } from 'react-hot-toast';


// Define the shape of our Task based on your Java Entity
export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
}

function App() {
   
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(null);
  const [entryMode, setEntryMode] = useState<'manual' | 'ai'>('manual');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');

  // Manual Mode Fields
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState(3);

  // AI Mode Fields
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTasksFromAi = async () => {
  if (!aiPrompt.trim()) return;
  const startTime = performance.now(); // 🏁 Start

  setIsGenerating(true);
  try {
    const response = await fetch('/tasks/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ prompt: aiPrompt }),
    });

    if (response.ok) {
      const endTime = performance.now(); // ⏱️ End
      setLastResponseTime(Math.round(endTime - startTime));
      toast.success('AI successfully generated tasks!', {
        icon: '✨',
        style: { border: '1px solid #8b5cf6', color: '#5b21b6' }
      });
      setAiPrompt(''); // Clear the AI input
      fetchTasks();    // Refresh list to show new tasks
    } else {
      toast.error('AI generation failed. Check backend logs.');
    }
  } catch (error) {
    console.error("Error calling AI endpoint:", error);
    toast.error('Network error while calling AI.');
  } finally {
    setIsGenerating(false);
  }
};
  // 1. Fetch Tasks (Like ngOnInit)
  const fetchTasks = async () => {
    const response = await fetch('/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Simple Create Task
  const addTask = async () => {
  if (!newTitle.trim()) return;
  const startTime = performance.now();

  const task: Task = { 
    title: newTitle, 
    description: newDescription, 
    priority: newPriority, 
    completed: false
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

    if (response.ok) {
      const endTime = performance.now(); // ⏱️ End
    setLastResponseTime(Math.round(endTime - startTime));
      toast.success('Task created successfully!', {
      style: {
        border: '1px solid #10b981',
        padding: '16px',
        color: '#065f46',
        borderRadius: '12px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#FFFAEE',
      },
    });
    // Reset all manual fields
    setNewTitle('');
    setNewDescription('');
    setNewPriority(3);
    fetchTasks();
  }
};
  // };
// 3. Toggle Task Completion (Updated with Performance Tracking)
const toggleTask = async (task: Task) => {
  const startTime = performance.now(); // 🏁 Start timing
  
  const updatedTask = { ...task, completed: !task.completed };
  
  try {
    const response = await fetch(`/tasks/${task.id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    
    if (response.ok) {
      const endTime = performance.now(); // ⏱️ End timing
      setLastResponseTime(Math.round(endTime - startTime));
      
      fetchTasks();
    }
  } catch (error) {
    toast.error('Network failure');
  }
};

// 4. Delete Task
const deleteTask = async (id: number) => {
  const response = await fetch(`/tasks/${id}`, { 
    method: 'DELETE' 
  });
  if (response.ok) {
// We use toast.error here to get the Red vibe automatically
    toast.error('Task permanently deleted', {
      icon: '🗑️', // Optional: adds a trash icon
      style: {
        border: '1px solid #f87171',
        padding: '16px',
        color: '#991b1b',
        borderRadius: '12px',
        backgroundColor: '#fef2f2' // Light red background
      },
    });
  }
  fetchTasks(); // Refresh the list
};
return (
  /* Main Container: adds a subtle gray background and centers content */
  <div className="min-h-screen bg-slate-50 py-12 px-4">
    <Toaster position="top-right" />
    <div className="max-w-3xl mx-auto">
      
      {/* Header Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Task Architect
        </h1>
        {lastResponseTime !== null && (
        <div className="fixed bottom-6 left-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-900/80 backdrop-blur-md text-[10px] text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${lastResponseTime < 100 ? 'bg-green-400' : 'bg-amber-400'}`} />
            <span>Last Sync: <strong>{lastResponseTime}ms</strong></span>
          </div>
  </div>
)}
        <p className="text-slate-500 mt-2">Manage your workflow with Quarkus & React</p>
      </header>

      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden transition-all">
  {/* Mode Switcher Tabs */}
  <div className="flex border-b border-slate-100 bg-slate-50/50">
    <button 
      onClick={() => setEntryMode('manual')}
      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
        entryMode === 'manual' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      Manual Entry
    </button>
    <button 
      onClick={() => setEntryMode('ai')}
      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
        entryMode === 'ai' ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      ✨ AI Brain Dump
    </button>
  </div>

  <div className="p-6">
    {entryMode === 'manual' ? (
      /* --- MANUAL MODE --- */
      <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            className="md:col-span-3 bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task Title..." 
          />
          <select 
            className="bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-600 font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            value={newPriority}
            onChange={(e) => setNewPriority(Number(e.target.value))}
          >
            <option value={1}>P1 - Critical</option>
            <option value={2}>P2 - High</option>
            <option value={3}>P3 - Medium</option>
            <option value={4}>P4 - Low</option>
            <option value={5}>P5 - Trivial</option>
          </select>
        </div>
        
        <textarea 
          className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={2}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Detailed description (optional)..."
        />

        <div className="flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            onClick={addTask}
            disabled={!newTitle.trim()}
          >
            Add Task
          </button>
        </div>
      </div>
    ) : (
      /* --- AI MODE --- */
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <textarea 
          className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
          rows={4}
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Paste meeting notes or a long paragraph here. AI will split it into multiple tasks..."
          disabled={isGenerating}
        />
        <div className="flex justify-end">
          <button 
            className={`bg-slate-900 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md ${
              isGenerating ? 'opacity-75 animate-pulse' : 'hover:bg-slate-800 active:scale-95'
            }`}
            onClick={generateTasksFromAi}
            disabled={isGenerating || !aiPrompt.trim()}
          >
            {isGenerating ? 'Processing...' : 'Generate with AI'}
          </button>
        </div>
      </div>
    )}
    </div>
  </div>

      {/* Task List: Each task is a clean white card */}
      <div className="grid gap-4">
      {[...tasks]
      .sort((a, b) =>{
        // Layer 1: If one is completed and the other isn't, push the completed one down
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Layer 2: If they are both completed OR both active, sort by priority
        return a.priority - b.priority;
      })
      .map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={toggleTask} 
          onDelete={deleteTask} 
        />
      ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No tasks found. Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default App;