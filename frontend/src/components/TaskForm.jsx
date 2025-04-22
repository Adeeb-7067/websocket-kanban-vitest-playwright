import React, { useState } from 'react';
import Select from 'react-select';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const CATEGORY_OPTIONS = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'enhancement', label: 'Enhancement' }
];

const customSelectStyles = {
  control: (base) => ({
    ...base,
    border: '1px solid #E5E7EB',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#7B68EE',
    },
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? '#7B68EE' : isFocused ? '#F3F4F6' : undefined,
    color: isSelected ? 'white' : '#374151',
  }),
};

const TaskForm = ({ onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'feature'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title.trim()) {
      onSubmit(task);
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        category: 'feature'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-clickup shadow-clickup p-6 mb-8">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Task title"
            required
            className="w-full px-4 py-2 text-clickup-gray-800 placeholder-clickup-gray-400 bg-white border border-clickup-gray-200 rounded-clickup focus:outline-none focus:border-clickup-purple focus:ring-2 focus:ring-clickup-purple/10 transition-all duration-200"
          />
        </div>
        <div>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Task description"
            className="w-full px-4 py-2 text-clickup-gray-800 placeholder-clickup-gray-400 bg-white border border-clickup-gray-200 rounded-clickup focus:outline-none focus:border-clickup-purple focus:ring-2 focus:ring-clickup-purple/10 transition-all duration-200 min-h-[100px] resize-y"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={PRIORITY_OPTIONS.find(opt => opt.value === task.priority)}
            onChange={(option) => setTask({ ...task, priority: option.value })}
            options={PRIORITY_OPTIONS}
            placeholder="Select priority"
            styles={customSelectStyles}
            className="text-clickup-gray-800"
          />
          <Select
            value={CATEGORY_OPTIONS.find(opt => opt.value === task.category)}
            onChange={(option) => setTask({ ...task, category: option.value })}
            options={CATEGORY_OPTIONS}
            placeholder="Select category"
            styles={customSelectStyles}
            className="text-clickup-gray-800"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-clickup-purple rounded-clickup hover:bg-clickup-purple-dark focus:outline-none focus:ring-2 focus:ring-clickup-purple/50 transition-all duration-200"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 