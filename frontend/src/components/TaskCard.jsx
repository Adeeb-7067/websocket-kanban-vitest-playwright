import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const TaskCard = ({ task, onUpdate, onDelete, onFileUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, column: task.column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(task.id, {
      title,
      description,
      priority,
      category,
    });
    setIsEditing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(task.id, file);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border border-clickup-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-purple"
          placeholder="Task title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border border-clickup-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-purple"
          placeholder="Task description"
          rows="3"
        />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border border-clickup-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-purple"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-clickup-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clickup-purple"
          >
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-clickup-gray-600 hover:text-clickup-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-clickup-purple rounded-md hover:bg-clickup-purple-dark"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-clickup-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-clickup-gray-500 hover:text-clickup-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-clickup-gray-500 hover:text-clickup-red-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-clickup-gray-600 mb-4">{task.description}</p>
      <div className="flex items-center space-x-4">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            task.priority === 'high'
              ? 'bg-clickup-red-100 text-clickup-red-700'
              : task.priority === 'medium'
              ? 'bg-clickup-yellow-100 text-clickup-yellow-700'
              : 'bg-clickup-green-100 text-clickup-green-700'
          }`}
        >
          {task.priority}
        </span>
        <span className="px-2 py-1 text-xs font-medium text-clickup-gray-600 bg-clickup-gray-100 rounded-full">
          {task.category}
        </span>
      </div>
      {task.attachments && task.attachments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-clickup-gray-700 mb-2">
            Attachments
          </h4>
          <div className="space-y-2">
            {task.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-clickup-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-clickup-purple"
                >
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <label className="block">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-clickup-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-clickup-purple file:text-white hover:file:bg-clickup-purple-dark"
          />
        </label>
      </div>
    </div>
  );
};

export default TaskCard; 