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

describe('KanbanBoard Unit Tests', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      priority: 'high',
      category: 'bug',
      column: 'To Do',
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

  it('renders loading state initially', () => {
    renderWithDndProvider();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders task form elements after loading', async () => {
    renderWithDndProvider();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task description')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('handles task creation', async () => {
    renderWithDndProvider();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('task:create', expect.objectContaining({
      title: 'New Task',
      description: 'New Description',
      column: 'To Do'
    }));
  });

  it('handles task deletion', async () => {
    renderWithDndProvider();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('task:delete', '1');
  });
});
