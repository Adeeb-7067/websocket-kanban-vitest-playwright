import React from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-clickup-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-clickup-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-clickup-purple">
                  Kanban Board
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-sm font-medium text-white bg-clickup-purple rounded-clickup hover:bg-clickup-purple-dark transition-colors duration-200">
                  New Task
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <KanbanBoard />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-clickup-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-clickup-gray-500 text-sm">
              Built with React, Socket.IO, and ❤️
            </p>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
