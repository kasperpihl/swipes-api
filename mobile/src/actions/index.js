export const request = () => (d, getState) => Promise.resolve(d({ type: 'HELLO' }));
