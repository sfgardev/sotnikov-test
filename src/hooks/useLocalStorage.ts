import { useState, useEffect } from "react";

type LocalStorageKeys = {
  activeTab: number;
  postsCountOnPage: number;
  favoritePostsIds: number[];
};

export function useLocalStorage<T>(
  key: keyof LocalStorageKeys,
  defaultValue: T
) {
  const [value, setValue] = useState<T>(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}
