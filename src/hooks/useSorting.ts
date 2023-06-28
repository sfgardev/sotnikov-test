import { useState } from "react";
import { SortBy, SortDirection } from "../components/Sorting";

export default function useSorting() {
  const [sortBy, setSortBy] = useState<SortBy>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("");

  const handleChangeSortDirection = (value: SortDirection) =>
    setSortDirection(value);

  const handleChangeSortBy = (value: SortBy) => setSortBy(value);

  return {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  };
}
