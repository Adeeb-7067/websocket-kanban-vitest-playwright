import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks, onMoveTask, onUpdateTask, onDeleteTask, onFileUpload }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.column !== title) {
        onMoveTask(item.id, title);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-white rounded-lg p-4 min-h-[500px] shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isOver ? 'bg-clickup-gray-50' : ''
      }`}
    >
      <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-clickup-gray-200">
        {title}
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onFileUpload={onFileUpload}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn; 