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

describe('WebSocket Integration', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Initial Task',
      description: 'Initial Description',
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

  it('receives initial tasks on connection', async () => {
    renderWithDndProvider();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify initial task is displayed
    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
      expect(screen.getByText('Initial Description')).toBeInTheDocument();
    });
  });

  it('receives task updates in real-time', async () => {
    renderWithDndProvider();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the task update callback
    const taskUpdateCallback = mockSocket.on.mock.calls.find(call => call[0] === 'task:updated')[1];
    
    // Simulate task update
    taskUpdateCallback({
      ...mockTasks[0],
      title: 'Updated Task',
      description: 'Updated Description'
    });

    // Verify UI updates
    await waitFor(() => {
      expect(screen.getByText('Updated Task')).toBeInTheDocument();
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
    });
  });

  it('receives new tasks in real-time', async () => {
    renderWithDndProvider();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Get the task create callback
    const taskCreateCallback = mockSocket.on.mock.calls.find(call => call[0] === 'task:created')[1];
    
    // Simulate new task creation
    taskCreateCallback({
      id: '2',
      title: 'New Task',
      description: 'New Description',
      priority: 'medium',
      category: 'feature',
      column: 'To Do',
      attachments: []
    });

    // Verify UI updates
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByText('New Description')).toBeInTheDocument();
    });
  });

  it('handles task deletion in real-time', async () => {
    renderWithDndProvider();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify initial task is present
    await waitFor(() => {
      expect(screen.getByText('Initial Task')).toBeInTheDocument();
    });

    // Get the task delete callback
    const taskDeleteCallback = mockSocket.on.mock.calls.find(call => call[0] === 'task:deleted')[1];
    
    // Simulate task deletion
    taskDeleteCallback('1');

    // Verify task is removed
    await waitFor(() => {
      expect(screen.queryByText('Initial Task')).not.toBeInTheDocument();
    });
  });
});
