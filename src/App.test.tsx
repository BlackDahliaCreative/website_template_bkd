import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import site from './site.config.json';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Dropdown from './components/DropdownSelect/DropdownSelect';

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  );

test('renders the main navigation', () => {
  renderAt('/');
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
});

// Every page in site.config.json must have a route in App.tsx (also with the trailing
// slash GitHub Pages adds), otherwise the pre-rendered file would show "Page not found".
test.each(site.pages.flatMap((p) => (p.path === '/' ? [p.path] : [p.path, `${p.path}/`])))(
  'site.config page %s has a route',
  async (path) => {
    renderAt(path);
    await waitFor(() => expect(document.querySelector('.page-loader')).toBeNull());
    expect(screen.queryByRole('heading', { name: /page not found/i })).toBeNull();
  }
);

test('shows the not-found page for unknown URLs', async () => {
  renderAt('/this-page-does-not-exist');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});

test('dropdown can be opened and used with the keyboard', () => {
  const onChange = vi.fn();
  render(
    <Dropdown
      label="Project type"
      options={[
        { value: 'branding', label: 'Branding' },
        { value: 'web', label: 'Web Design' },
      ]}
      value={null}
      onChange={onChange}
    />
  );

  const button = screen.getByRole('button');
  button.focus();
  fireEvent.keyDown(button, { key: 'ArrowDown' });   // opens and moves focus into the list
  const list = screen.getByRole('listbox');
  expect(list).toHaveFocus();

  fireEvent.keyDown(list, { key: 'ArrowDown' });     // move to the second option
  fireEvent.keyDown(list, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith('web');
  expect(button).toHaveFocus();
});
