import { Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export type SortDirection = "asc" | "desc" | "";
export type SortBy = "id" | "title" | "username" | "isFavorite" | "";

type SortingProps = {
  sortDirection: SortDirection;
  sortBy: SortBy;
  onChangeSortDirection: (value: SortDirection) => void;
  onChangeSortBy: (value: SortBy) => void;
};

export default function Sorting({
  sortBy,
  sortDirection,
  onChangeSortBy,
  onChangeSortDirection,
}: SortingProps) {
  return (
    <Stack sx={{ mb: 2 }} direction="row" gap=".75rem">
      <FormControl size="small" sx={{ width: "110px" }}>
        <InputLabel id="demo-simple-select-label">Direction</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortDirection}
          label="Direction"
          onChange={(e) =>
            onChangeSortDirection(e.target.value as SortDirection)
          }
        >
          <MenuItem value="asc">Asc</MenuItem>
          <MenuItem value="desc">Desc</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ width: "110px" }}>
        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortBy}
          label="Sort by"
          onChange={(e) => onChangeSortBy(e.target.value as SortBy)}
        >
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="username">User name</MenuItem>
          <MenuItem value="isFavorite">Favorites</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
