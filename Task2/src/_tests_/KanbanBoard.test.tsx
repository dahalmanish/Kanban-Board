import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from '../components/KanbanBoard';

// Your other imports...

it('should drag and drop tasks between columns', async () => {
  render(<KanbanBoard />);

  // Add a column and a task
  userEvent.click(screen.getByText('Add Column'));
  userEvent.click(screen.getByText('Add task'));

  const task = screen.getByText('Task 1');
  const targetColumn = screen.getByText('Column 1');

  // Manually simulate drag and drop events
  fireEvent.dragStart(task);
  fireEvent.dragOver(targetColumn);  // Required to make the drop target valid
  fireEvent.drop(targetColumn);  // Drop the task onto the column

  // Check if task is moved to the new column
  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });
});
