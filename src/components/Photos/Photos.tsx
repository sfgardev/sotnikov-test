import { useFetch } from "../../hooks/useFetch";
import useFilters from "../../hooks/useFilters";
import { usePagination } from "../../hooks/usePagination";
import useSorting from "../../hooks/useSorting";
import Filters from "../Filters";
import { UserModel } from "../Posts/types";
import SelectPagiantion from "../SelectPagination";
import Sorting from "../Sorting";

export default function Photos() {
  const { data: usersApi } = useFetch<UserModel[]>("users");

  const userNames = (usersApi ?? []).map((user) => user.name);

  const {
    itemsNumberPerPage: photosNumberPerPage,
    handleChangeItemsNumberPerPage,
  } = usePagination("photosCountOnPage");

  const {
    search,
    isFavorites,
    selectedUsersFilter,
    handleFilterByUsers,
    handleSearch,
    handleToggleFilterByFavorites,
  } = useFilters();

  const {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  } = useSorting();

  return (
    <>
      <SelectPagiantion
        itemsPerPage={photosNumberPerPage}
        onChangeItemsPerPage={handleChangeItemsNumberPerPage}
      />
      <Sorting
        sortBy={sortBy}
        sortDirection={sortDirection}
        onChangeSortBy={handleChangeSortBy}
        onChangeSortDirection={handleChangeSortDirection}
      />
      <Filters
        search={search}
        userNames={userNames}
        isFavorites={isFavorites}
        selectedUsersFilter={selectedUsersFilter}
        onSearch={handleSearch}
        onFilter={handleFilterByUsers}
        onToggleFilterByFavorites={handleToggleFilterByFavorites}
      />
    </>
  );
}
