import type { Task } from '../App.tsx';
import { useState } from 'react';


interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {

  const [showModal, setShowModal] = useState(false);
  
    // Helper to determine badge colors
  const getPriorityColors = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-50 text-red-700 border-red-200';
      case 2: return 'bg-orange-50 text-orange-700 border-orange-200';
      case 3: return 'bg-amber-50 text-amber-700 border-amber-200';
      case 4: return 'bg-blue-50 text-blue-700 border-blue-200';
      case 5: return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* 1. THE TASK CARD */}
      <div className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4 flex-1 cursor-pointer">
          {/* Checkbox */}
          <div 
            onClick={() => onToggle(task)}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-blue-400'
            }`}
          >
            {task.completed && <span className="text-white text-xs">✓</span>}
          </div>
          
          {/* Title Area - Click opens modal */}
          <div 
            className="flex flex-col flex-1 min-w-0 justify-center items-start text-left"
            onClick={() => setShowModal(true)} 
          >
            <span className={`text-base font-semibold truncate w-full ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.title}
            </span>
            <div className="mt-1 flex gap-2 items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getPriorityColors(task.priority)}`}>
                Priority {task.priority}
              </span>
              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity italic">Click to view details</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id!)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
        >
          Delete
        </button>
      </div>

      {/* 2. THE MODAL (Pop-up) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b border-slate-100 flex justify-between items-start`}>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border mb-2 ${getPriorityColors(task.priority)}`}>
                  Priority {task.priority}
                </span>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight">{task.title}</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Task Description</h4>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {task.description || "This task has no detailed description."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
                onClick={() => { onToggle(task); setShowModal(false); }}
                className={`px-6 py-2 rounded-xl font-semibold border transition-all active:scale-95 ${
                    task.completed 
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300' 
                    : 'bg-green-600 text-white border-transparent hover:bg-green-700 shadow-sm'
                }`}
            >
                {task.completed ? 'Mark Incomplete' : 'Complete Task'}
            </button>
            
            <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
                Close
            </button>
            </div>
          </div>
          
          {/* Click background to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setShowModal(false)} />
        </div>
      )}
    </>
  );
};