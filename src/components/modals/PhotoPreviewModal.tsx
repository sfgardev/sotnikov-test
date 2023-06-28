import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
};

type PhotoPreviewModalProps = {
  url: string;
  title: string;
  show: boolean;
  onClose: () => void;
};

export default function PhotoPreviewModal({
  url,
  title,
  show,
  onClose,
}: PhotoPreviewModalProps) {
  return (
    <div>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={url} alt={title} />
        </Box>
      </Modal>
    </div>
  );
}
