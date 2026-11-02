/**
 * The code of the chosen make travels in the browser's navigation state, so it never appears in the address bar.
 * The state survives a page refresh, which is why it is read from the history entry.
 */
export function readMakeCodeFromHistory(): string | null {
  const state: unknown = history.state;
  if (typeof state === 'object' && state !== null && 'makeCode' in state) {
    const makeCode = state.makeCode;
    return typeof makeCode === 'string' && makeCode.length > 0 ? makeCode : null;
  }
  return null;
}
