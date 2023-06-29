import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";

type TodosFilterProps = {
  search: string;
  completed: boolean;
  onSearch: (value: string) => void;
  onToggleCompleted: () => void;
};
export default function TodosFilter({
  search,
  completed,
  onSearch,
  onToggleCompleted,
}: TodosFilterProps) {
  return (
    <Stack direction="row" gap=".75rem">
      <TextField
        label="Search by title..."
        size="small"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <FormControlLabel
        control={<Switch value={completed} onChange={onToggleCompleted} />}
        label="Completed"
      />
    </Stack>
  );
}
