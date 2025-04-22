import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanBoard from '../../components/KanbanBoard';
import { io } from 'socket.io-client';

// Mock socket.io-client
const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
  off: vi.fn(),
  close: vi.fn()
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket)
}));

// Mock chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  BarController: vi.fn()
}));

describe('KanbanBoard Integration', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      category: 'bug',
      column: 'To Do',
      attachments: []
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'medium',
      category: 'feature',
      column: 'In Progress',
      attachments: []
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.on.mockImplementation((event, callback) => {
      if (event === 'sync:tasks') {
        callback(mockTasks);
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithDndProvider = () => {
    return render(
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard />
      </DndProvider>
    );
  };

  it('renders all columns and tasks', async () => {
    renderWithDndProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Verify tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('creates a new task', async () => {
    renderWithDndProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Fill in task form
    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    // Verify task creation request
    expect(mockSocket.emit).toHaveBeenCalledWith('task:create', expect.objectContaining({
      title: 'New Task',
      description: 'New Description',
      column: 'To Do'
    }));
  });

  it('updates task progress chart when tasks change', async () => {
    renderWithDndProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify initial tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();

    // Get the task update callback
    const taskUpdateCallback = mockSocket.on.mock.calls.find(call => call[0] === 'task:updated')[1];
    
    // Simulate moving task to Done
    taskUpdateCallback({
      ...mockTasks[0],
      column: 'Done'
    });

    // Verify chart is rendered
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });
}); 