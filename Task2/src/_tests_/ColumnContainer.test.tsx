// __tests__/ColumnContainer.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ColumnContainer from '../components/ColumnContainer';
import { Column, Task } from '../type';

// Mock data
const column: Column = {
  id: 1,
  title: 'Test Column',
};

const tasks: Task[] = [
  { id: 1, columnId: 1, content: 'Task 1' },
  { id: 2, columnId: 1, content: 'Task 2' },
];

const deleteColumnMock = jest.fn();
const updateColumnMock = jest.fn();
const createTaskMock = jest.fn();
const deleteTaskMock = jest.fn();
const updateTaskMock = jest.fn();

describe('ColumnContainer Component', () => {
  it('should render column title correctly', () => {
    render(
      <ColumnContainer
        column={column}
        tasks={tasks}
        deleteColumn={deleteColumnMock}
        updateColumn={updateColumnMock}
        createTask={createTaskMock}
        deleteTask={deleteTaskMock}
        updateTask={updateTaskMock}
      />
    );
    expect(screen.getByText('Test Column')).toBeInTheDocument();
  });

  it('should call createTask when "Add Task" button is clicked', () => {
    render(
      <ColumnContainer
        column={column}
        tasks={tasks}
        deleteColumn={deleteColumnMock}
        updateColumn={updateColumnMock}
        createTask={createTaskMock}
        deleteTask={deleteTaskMock}
        updateTask={updateTaskMock}
      />
    );
    fireEvent.click(screen.getByText('Add task'));
    expect(createTaskMock).toHaveBeenCalledWith(1);
  });

  it('should call deleteColumn when delete button is clicked', () => {
    render(
      <ColumnContainer
        column={column}
        tasks={tasks}
        deleteColumn={deleteColumnMock}
        updateColumn={updateColumnMock}
        createTask={createTaskMock}
        deleteTask={deleteTaskMock}
        updateTask={updateTaskMock}
      />
    );
    fireEvent.click(screen.getByTitle('Delete'));
    expect(deleteColumnMock).toHaveBeenCalledWith(1);
  });
});
