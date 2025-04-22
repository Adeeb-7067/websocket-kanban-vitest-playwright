import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskCard from '../../components/TaskCard';

// Mock react-select
vi.mock('react-select', () => ({
  default: vi.fn(({ options, value, onChange }) => (
    <select
      data-testid="select"
      value={value?.value}
      onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  ))
}));

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    category: 'feature',
    column: 'To Do',
    attachments: []
  };

  const mockProps = {
    task: mockTask,
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    onFileUpload: vi.fn()
  };

  const renderWithDndProvider = (component) => {
    return render(
      <DndProvider backend={HTML5Backend}>
        {component}
      </DndProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task details correctly', () => {
    renderWithDndProvider(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('feature')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithDndProvider(<TaskCard {...mockProps} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('switches to edit mode when edit button is clicked', () => {
    renderWithDndProvider(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task description')).toBeInTheDocument();
  });

  it('handles file upload correctly', () => {
    renderWithDndProvider(<TaskCard {...mockProps} />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload File');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockProps.onFileUpload).toHaveBeenCalledWith('1', file);
  });
}); 