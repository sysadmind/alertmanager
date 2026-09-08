import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { getPathPrefix } from '@/lib/pathPrefix';

export type Settings = {
  // The Alertmanager path prefix, derived from the browser location so that
  // deployments behind `--web.route-prefix` or a reverse proxy work without
  // additional configuration.
  pathPrefix: string;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

// UseSettings returns the application settings. It must be called from within a
// SettingsProvider.
export const useSettings = (): Settings => {
  const settings = useContext(SettingsContext);
  if (settings === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return settings;
};

type SettingsProviderProps = {
  children: ReactNode;
  // Overrides the derived settings. Intended for tests, which need to point the
  // application at an ephemeral server.
  settings?: Partial<Settings>;
};

// SettingsProvider makes the application settings available to the tree below
// it.
export const SettingsProvider = ({ children, settings }: SettingsProviderProps) => {
  const value = useMemo(
    () => ({
      pathPrefix: settings?.pathPrefix ?? getPathPrefix(window.location.pathname),
    }),
    [settings?.pathPrefix]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
