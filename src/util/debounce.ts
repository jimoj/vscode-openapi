export type DebounceDelay = {
  delay: number;
};

export function debounce<A extends unknown[], R>(fn: (...args: A) => R, options: DebounceDelay) {
  return (...args: A): Promise<R> => {
    let timer: NodeJS.Timeout;
    return new Promise((resolve) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        resolve(fn(...args));
      }, options.delay);
    });
  };
}
