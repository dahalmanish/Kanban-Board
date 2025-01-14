// __tests__/TaskCard.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from "../components/TaskCard";
import { Task } from '../type';

// Mock data
const task: Task = {
  id: 1,
  columnId: 1,
  content: 'Test Task',
};

const deleteTaskMock = jest.fn();
const updateTaskMock = jest.fn();

describe('TaskCard Component', () => {
  it('should render the task content correctly', () => {
    render(
      <TaskCard task={task} deleteTask={deleteTaskMock} updateTask={updateTaskMock} />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should call deleteTask function when trash icon is clicked', () => {
    render(
      <TaskCard task={task} deleteTask={deleteTaskMock} updateTask={updateTaskMock} />
    );
    fireEvent.click(screen.getByRole('button')); // Simulate clicking delete button
    expect(deleteTaskMock).toHaveBeenCalledWith(1); // Check that deleteTask was called with the correct id
  });

  it('should trigger updateTask function when task content is changed', () => {
    render(
      <TaskCard task={task} deleteTask={deleteTaskMock} updateTask={updateTaskMock} />
    );
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Updated Task Content' },
    });
    expect(updateTaskMock).toHaveBeenCalledWith(1, 'Updated Task Content');
  });
});
