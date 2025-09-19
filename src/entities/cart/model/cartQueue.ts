const queues = new Map<string, Promise<unknown>>();

export const enqueue = <T>(key: string, task: () => Promise<T>): Promise<T> => {
  const last = queues.get(key) ?? Promise.resolve();
  const next = last.catch(() => {}).then(task);
  queues.set(key, next);
  return next;
};
