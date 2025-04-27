/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to delay in milliseconds
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
