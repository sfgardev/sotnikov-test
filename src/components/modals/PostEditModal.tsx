import { Box, Button, FormControl, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { PostEditModalState, PostEditState } from "../Posts/types";

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

type PostEditModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (post: PostEditState) => void;
};

export default function PostEditModal({
  open,
  body,
  id,
  title,
  username,
  onClose,
  onConfirm,
}: PostEditModalProps & PostEditModalState) {
  const [editPostForm, setEditPostForm] = useState<PostEditState>({
    id: -1,
    body: "",
    title: "",
    username: "",
  });

  useEffect(() => {
    setEditPostForm({ body, id, title, username });
  }, [body, id, title, username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditPostForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(editPostForm);
    onClose();
  };

  const handleCancel = () => {
    setEditPostForm({ body, id, title, username });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ width: "100%", gap: "1rem" }}>
            <TextField
              size="small"
              label="Name"
              name="username"
              value={editPostForm.username}
              onChange={handleChange}
            />
            <TextField
              size="small"
              label="Title"
              name="title"
              value={editPostForm.title}
              onChange={handleChange}
            />
            <TextField
              multiline
              rows={5}
              label="Text"
              name="body"
              value={editPostForm.body}
              onChange={handleChange}
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
