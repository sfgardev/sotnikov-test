import { useState } from "react";
import { SortDirection } from "../components/Sorting";

export default function useSorting<TSortBy>(
  defaultSortBy = "" as TSortBy,
  defaultSortDirection = "asc" as SortDirection
) {
  const [sortBy, setSortBy] = useState<TSortBy>(defaultSortBy as TSortBy);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);

  const handleChangeSortDirection = (value: SortDirection) =>
    setSortDirection(value);

  const handleChangeSortBy = (value: TSortBy) => setSortBy(value);

  return {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  };
}
