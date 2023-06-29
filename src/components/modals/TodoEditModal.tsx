import { Box, Button, FormControl, Modal, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "70%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type TodoEditModalProps = {
  show: boolean;
  todoId: number;
  title: string;
  onClose: () => void;
  onEditTodo: (title: string, todoId: number) => void;
};

export default function TodoEditModal({
  show,
  todoId,
  title,
  onClose,
  onEditTodo,
}: TodoEditModalProps) {
  const [titleToEdit, setTitleToEdit] = useState(title);

  useEffect(() => {
    setTitleToEdit(title);
  }, [title]);

  const handleEditTodo = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleToEdit(e.target.value);
  };

  const handleConfirm = () => {
    onEditTodo(titleToEdit, todoId);
    onClose();
  };

  const handleCancel = () => {
    setTitleToEdit(title);
  };

  return (
    <div>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ width: "100%", gap: "1rem" }}>
            <TextField
              size="small"
              label="Title"
              name="title"
              value={titleToEdit}
              onChange={handleEditTodo}
            />

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="inherit"
                sx={{ ml: ".5rem" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
