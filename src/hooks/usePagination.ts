import { LocalStorageKeys, useLocalStorage } from "./useLocalStorage";

type LocalStoragePaginationKeys = keyof Pick<
  LocalStorageKeys,
  | "postsCountOnPage"
  | "photosCountOnPage"
  | "tasksCountOnPage"
  | "todosCountOnPage"
>;

export function usePagination(
  localStoragePaginationKey: LocalStoragePaginationKeys
) {
  const [itemsNumberPerPage, setItemsNumberPerPage] = useLocalStorage<number>(
    localStoragePaginationKey,
    10
  );

  const handleChangeItemsNumberPerPage = (numPerPage: number) => {
    setItemsNumberPerPage(numPerPage);
  };

  return {
    itemsNumberPerPage,
    handleChangeItemsNumberPerPage,
  };
}
