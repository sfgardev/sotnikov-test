import { Modal, Box, FormControl, TextField, Button } from "@mui/material";
import { useState } from "react";

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

type AddNewTodoModalProps = {
  show: boolean;
  onAddNewTodo: (title: string) => void;
  onClose: () => void;
};

export default function AddNewTodoModal({
  show,
  onClose,
  onAddNewTodo,
}: AddNewTodoModalProps) {
  const [title, setTitle] = useState("");

  const handleAddTodo = () => {
    onAddNewTodo(title);
    setTitle("");
    onClose();
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTodo}
              >
                Save
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
