import { render, screen } from '@testing-library/react';

import { SettingsProvider, useSettings } from './settings';

function ShowPrefix() {
  const { pathPrefix } = useSettings();
  return <span data-testid="prefix">{pathPrefix === '' ? '<empty>' : pathPrefix}</span>;
}

describe('SettingsProvider', () => {
  it('derives the path prefix from the browser location', () => {
    window.history.replaceState({}, '', '/am/ui/alerts');

    render(
      <SettingsProvider>
        <ShowPrefix />
      </SettingsProvider>
    );

    expect(screen.getByTestId('prefix')).toHaveTextContent('/am');
  });

  it('derives an empty path prefix when served at the root', () => {
    window.history.replaceState({}, '', '/ui/');

    render(
      <SettingsProvider>
        <ShowPrefix />
      </SettingsProvider>
    );

    expect(screen.getByTestId('prefix')).toHaveTextContent('<empty>');
  });

  it('allows the derived settings to be overridden', () => {
    window.history.replaceState({}, '', '/am/ui/');

    render(
      <SettingsProvider settings={{ pathPrefix: '/override' }}>
        <ShowPrefix />
      </SettingsProvider>
    );

    expect(screen.getByTestId('prefix')).toHaveTextContent('/override');
  });
});

describe('useSettings', () => {
  it('throws when used outside of a SettingsProvider', () => {
    // React logs the error boundary trace; silence it for this expected throw.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ShowPrefix />)).toThrow(
      'useSettings must be used within a SettingsProvider'
    );
    spy.mockRestore();
  });
});
