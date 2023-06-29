import { Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export type SortDirection = "asc" | "desc" | "";
export type SortBy = "id" | "title" | "username" | "";

export type SortByItem = {
  label: string;
  value: string;
};

type SortingProps<TSortBy> = {
  sortDirection: SortDirection;
  sortBy: TSortBy;
  sortByItems: SortByItem[];
  onChangeSortDirection: (value: SortDirection) => void;
  onChangeSortBy: (value: TSortBy) => void;
};

export default function Sorting<TSortBy>({
  sortBy,
  sortDirection,
  sortByItems,
  onChangeSortBy,
  onChangeSortDirection,
}: SortingProps<TSortBy>) {
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
          onChange={(e) => onChangeSortBy(e.target.value as TSortBy)}
        >
          {sortByItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
