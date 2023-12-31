import { Box, Button, Modal, Typography } from "@mui/material";

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

type ConfirmationModalProps = {
  open: boolean;
  text: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmationModal({
  open,
  text,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {text}
          </Typography>

          <Box sx={{ textAlign: "right", mt: "1rem" }}>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              Confirm
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{ ml: ".5rem" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
