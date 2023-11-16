import { render, screen } from 'test/utilities';
import { PackingList } from '.';
import userEvent from '@testing-library/user-event';
import { createStore } from './store';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

const renderWithProvider: typeof render = (Component, options) => {
  const store = createStore();

  const WrapperWithProvider = ({ children }: PropsWithChildren) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(Component, { ...options, wrapper: WrapperWithProvider });
};

it('renders the Packing List application', () => {
  renderWithProvider(<PackingList />);
});

it('has the correct title', async () => {
  renderWithProvider(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  renderWithProvider(<PackingList />);
  screen.getByPlaceholderText('New Item');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  renderWithProvider(<PackingList />);
  const input = screen.getByPlaceholderText('New Item');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  expect(input).toHaveValue('');
  expect(button).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  renderWithProvider(<PackingList />);
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText('New Item');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'iPhone 14');

  expect(button).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  renderWithProvider(<PackingList />);
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText('New Item');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'iPhone 14');
  await user.click(button);

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
});

it('should clear the input field when clicking "Add New Item"', async () => {
  renderWithProvider(<PackingList />);
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText('New Item');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'iPhone 14');
  expect(input).toHaveValue('iPhone 14');

  await user.click(button);
  expect(input).toHaveValue('');
});

it('remove an item from the unpacked item list when the clicking "Remove" button', async () => {
  renderWithProvider(<PackingList />);
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText('New Item');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'iPhone 14');
  await user.click(button);

  const removeBtn = screen.getByRole('button', { name: 'Remove iPhone 14' });
  await user.click(removeBtn);

  expect(removeBtn).not.toBeInTheDocument();
});
