import { Box, NativeSelect } from "@mui/material";
import FormControl from "@mui/material/FormControl";

type SelectPaginationProps = {
  itemsPerPage: number;
  onChangeItemsPerPage: (numPerPage: number) => void;
};

export default function SelectPagination({
  itemsPerPage,
  onChangeItemsPerPage,
}: SelectPaginationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeItemsPerPage(+e.target.value);
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        display: "flex",
        justifyContent: "flex-end",
        mb: "1rem",
      }}
    >
      <FormControl>
        <NativeSelect value={itemsPerPage} onChange={handleChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
