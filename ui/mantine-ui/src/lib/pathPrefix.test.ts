import { getPathPrefix } from './pathPrefix';

describe('getPathPrefix', () => {
  it('returns an empty prefix for the application root', () => {
    expect(getPathPrefix('/ui/')).toBe('');
    expect(getPathPrefix('/ui')).toBe('');
  });

  it('returns an empty prefix for client-side routes at the root mount', () => {
    expect(getPathPrefix('/ui/alerts')).toBe('');
    expect(getPathPrefix('/ui/silences')).toBe('');
    expect(getPathPrefix('/ui/status')).toBe('');
    expect(getPathPrefix('/ui/config')).toBe('');
  });

  it('strips a trailing slash from client-side routes', () => {
    expect(getPathPrefix('/ui/alerts/')).toBe('');
    expect(getPathPrefix('/am/ui/alerts/')).toBe('/am');
  });

  it('derives the prefix from a route-prefixed deployment', () => {
    expect(getPathPrefix('/am/ui/')).toBe('/am');
    expect(getPathPrefix('/am/ui/alerts')).toBe('/am');
    expect(getPathPrefix('/alertmanager/ui/silences')).toBe('/alertmanager');
  });

  it('derives the prefix from a nested route prefix', () => {
    expect(getPathPrefix('/monitoring/am/ui/')).toBe('/monitoring/am');
    expect(getPathPrefix('/monitoring/am/ui/status')).toBe('/monitoring/am');
  });

  it('strips path parameters from detail routes', () => {
    expect(getPathPrefix('/ui/silence/abc-123')).toBe('');
    expect(getPathPrefix('/am/ui/silence/abc-123')).toBe('/am');
  });

  it('keeps a prefix that contains a page path', () => {
    expect(getPathPrefix('/alerts/ui/alerts')).toBe('/alerts');
    expect(getPathPrefix('/alerts/ui/')).toBe('/alerts');
    expect(getPathPrefix('/status/ui/config')).toBe('/status');
  });

  it('keeps a prefix that is itself /ui', () => {
    expect(getPathPrefix('/ui/ui/')).toBe('/ui');
    expect(getPathPrefix('/ui/ui/alerts')).toBe('/ui');
  });

  it('returns an empty prefix when the location is not under the mount point', () => {
    expect(getPathPrefix('/')).toBe('');
    expect(getPathPrefix('')).toBe('');
  });

  it('resolves routes it does not know about', () => {
    // The prefix must not depend on the set of client-side routes, so adding a
    // page does not require a change here.
    expect(getPathPrefix('/ui/receivers')).toBe('');
    expect(getPathPrefix('/am/ui/receivers')).toBe('/am');
    expect(getPathPrefix('/am/ui/silences/new/preview')).toBe('/am');
  });

  it('only matches the mount point on a whole path segment', () => {
    expect(getPathPrefix('/uiassets/ui/alerts')).toBe('/uiassets');
    expect(getPathPrefix('/am/uiassets')).toBe('/am/uiassets');
  });
});
