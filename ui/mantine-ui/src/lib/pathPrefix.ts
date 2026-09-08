// The path the Mantine application is mounted at, relative to the prefix. Must
// match the routes registered in `ui/web.go`.
const appRoot = '/ui';

// GetPathPrefix derives the Alertmanager path prefix from the browser location,
// so that a deployment behind `--web.route-prefix` or a reverse proxy works
// without additional configuration.
//
// The application is always served under `<prefix>/ui/`, so the prefix is
// whatever precedes the last `/ui` path segment. Searching right to left keeps a
// prefix that itself contains `/ui` intact, and requiring a whole segment means
// a sibling such as `/uiassets` is not mistaken for the mount point.
//
// Deliberately independent of the client-side routes: adding a page must not
// require a change here.
export const getPathPrefix = (pathname: string): string => {
  let path = pathname;

  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  for (let i = path.lastIndexOf(appRoot); i >= 0; i = path.lastIndexOf(appRoot, i - 1)) {
    const end = i + appRoot.length;
    if (end === path.length || path[end] === '/') {
      return path.slice(0, i);
    }
  }

  // The location is not under the mount point, so there is nothing to strip.
  return path;
};
