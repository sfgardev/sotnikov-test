import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
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

type AddNewPostModalProps = {
  userNames: string[];
  open: boolean;
  onClose: () => void;
  onAddNewPost: (title: string, body: string, username: string) => void;
};

export default function AddNewPostModal({
  open,
  userNames,
  onClose,
  onAddNewPost,
}: AddNewPostModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  const isValid = title && body && selectedUserName;

  const handleAddPost = () => {
    onAddNewPost(title, body, selectedUserName);
    setTitle("");
    setBody("");
    setSelectedUserName("");
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
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              multiline
              rows={5}
              label="Text"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="demo-simple-select-label">User name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedUserName}
                label="User name"
                onChange={(e) => setSelectedUserName(e.target.value)}
              >
                {userNames.map((user) => (
                  <MenuItem key={user} value={user}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPost}
                disabled={!isValid}
              >
                Add
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
