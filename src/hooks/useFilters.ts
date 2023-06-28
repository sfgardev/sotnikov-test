import { useState } from "react";

export default function useFilters() {
  const [search, setSearch] = useState("");
  const [isFavorites, setIsFavorites] = useState(false);
  const [selectedUsersFilter, setSelectedUsersFilter] = useState<string[]>([]);

  const handleSearch = (searchValue: string) => setSearch(searchValue);

  const handleFilterByUsers = (userNames: string[]) =>
    setSelectedUsersFilter(userNames);

  const handleToggleFilterByFavorites = () => setIsFavorites((prev) => !prev);

  return {
    search,
    isFavorites,
    selectedUsersFilter,
    handleSearch,
    handleFilterByUsers,
    handleToggleFilterByFavorites,
  };
}
