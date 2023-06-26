import { Box, Button, FormControl, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { PostWithAdditionalInfo } from "../Posts/Posts";

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

export type PostEditState = Pick<
  PostWithAdditionalInfo,
  "id" | "username" | "title" | "body"
>;

type BasicModalProps = {
  open: boolean;
  postEditState: PostEditState;
  onClose: () => void;
  onConfirm: (post: PostEditState) => void;
};

export default function BasicModal({
  open,
  postEditState,
  onClose,
  onConfirm,
}: BasicModalProps) {
  const [editPostForm, setEditPostForm] = useState<PostEditState>({
    id: -1,
    body: "",
    title: "",
    username: "",
  });

  useEffect(() => {
    setEditPostForm(postEditState);
  }, [postEditState]);

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
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              save
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
