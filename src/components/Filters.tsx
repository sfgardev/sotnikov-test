import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

type FilterProps = {
  search: string;
  userNames: string[];
  isFavorites: boolean;
  selectedUsersFilter: string[];
  onFilter: (names: string[]) => void;
  onSearch: (value: string) => void;
  onToggleFilterByFavorites: () => void;
};

export default function Filter({
  search,
  userNames,
  isFavorites,
  selectedUsersFilter,
  onFilter,
  onSearch,
  onToggleFilterByFavorites,
}: FilterProps) {
  const handleChange = (e: SelectChangeEvent<typeof selectedUsersFilter>) => {
    const { value } = e.target;

    onFilter(typeof value === "string" ? value.split(", ") : value);
  };

  return (
    <Stack direction="row" gap=".75rem" flexWrap="wrap">
      <TextField
        label="Search by title..."
        size="small"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <FormControl sx={{ width: 250 }} size="small">
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedUsersFilter}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
        >
          {userNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch value={isFavorites} onChange={onToggleFilterByFavorites} />
        }
        label="Favorites"
      />
    </Stack>
  );
}
