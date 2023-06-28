import { useMemo, useState } from "react";

export const useSet = <TValue>(initialValue?: Iterable<TValue>) => {
  const [set] = useState(() => new Set(initialValue));
  const [, setSize] = useState(set.size);

  const actions = useMemo(
    () => ({
      add(value: TValue) {
        const result = set.add(value);
        setSize(set.size);
        return result;
      },

      has(value: TValue) {
        return set.has(value);
      },
      delete(value: TValue) {
        const result = set.delete(value);
        setSize(set.size);
        return result;
      },

      each(mapper: (value: TValue) => void) {
        set.forEach((item) => {
          mapper(item);
        });
      },

      clear() {
        set.clear();
        setSize(0);
      },
      get size() {
        return set.size;
      },
    }),
    [set]
  );

  return [set as ReadonlySet<TValue>, actions] as const;
};
