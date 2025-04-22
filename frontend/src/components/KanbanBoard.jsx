import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import ProgressChart from './ProgressChart';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Set up event listeners
    newSocket.on('sync:tasks', (initialTasks) => {
      setTasks(initialTasks);
      setIsLoading(false);
    });

    newSocket.on('task:created', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    newSocket.on('task:updated', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    });

    newSocket.on('task:moved', ({ taskId, newColumn }) => {
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, column: newColumn } : task
      ));
    });

    newSocket.on('task:deleted', (taskId) => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    });

    // Clean up on unmount
    return () => {
      newSocket.off('sync:tasks');
      newSocket.off('task:created');
      newSocket.off('task:updated');
      newSocket.off('task:moved');
      newSocket.off('task:deleted');
      newSocket.close();
    };
  }, []); // Only run once on mount

  const handleCreateTask = (taskData) => {
    if (!socket) return;
    socket.emit('task:create', { ...taskData, column: 'To Do' });
  };

  const handleUpdateTask = (taskId, updates) => {
    if (!socket) return;
    socket.emit('task:update', { taskId, ...updates });
  };

  const handleMoveTask = (taskId, newColumn) => {
    if (!socket) return;
    socket.emit('task:move', { taskId, newColumn });
  };

  const handleDeleteTask = (taskId) => {
    if (!socket) return;
    socket.emit('task:delete', taskId);
  };

  const handleFileUpload = (taskId, file) => {
    if (!socket) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      socket.emit('task:upload', {
        taskId,
        fileData: {
          name: file.name,
          type: file.type,
          data: e.target.result
        }
      });
    };
    reader.readAsArrayBuffer(file);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-lg text-clickup-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TaskForm onSubmit={handleCreateTask} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column}
            title={column}
            tasks={tasks.filter(task => task.column === column)}
            onMoveTask={handleMoveTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onFileUpload={handleFileUpload}
          />
        ))}
      </div>
      <ProgressChart tasks={tasks} />
    </div>
  );
};

export default KanbanBoard;
