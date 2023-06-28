import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
    Box,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

type ListWithCheckboxProps<T extends { id: number }> = {
  selectedItemsSet: ReadonlySet<number>;
  items: Array<T>;
  renderPrimary: (item: T) => React.ReactNode;
  renderSecondary: (item: T) => React.ReactNode;
  onSelectItem: (itemId: number) => void;
  onOpenAddToFavoriteConfirmationModal: () => void;
  onOpenDeleteConfirmationItemModal: () => void;
};

export default function ListWithCheckbox<T extends { id: number }>({
  selectedItemsSet,
  items,
  renderPrimary,
  renderSecondary,
  onSelectItem,
  onOpenAddToFavoriteConfirmationModal,
  onOpenDeleteConfirmationItemModal,
}: ListWithCheckboxProps<T>) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {selectedItemsSet.size > 0 && (
        <Box>
          <IconButton
            aria-label="favorites"
            onClick={onOpenAddToFavoriteConfirmationModal}
          >
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={onOpenDeleteConfirmationItemModal}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </Box>
      )}
      {items.map((item) => {
        const labelId = `checkbox-list-label-${item.id}`;

        return (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => onSelectItem(item.id)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedItemsSet.has(item.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={renderPrimary(item)}
                secondary={renderSecondary(item)}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
