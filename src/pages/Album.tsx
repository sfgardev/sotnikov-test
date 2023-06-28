import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useMemo } from "react";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import PhotoPreviewModal from "../components/modals/PhotoPreviewModal";
import { useModalState } from "../hooks/useModalState";

type PhotoModel = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

type PhotoModalState = {
  show: boolean;
  title: string;
  url: string;
};

export default function Album() {
  const [photoModalState, closePhotoModal, updatePhotoModalState] =
    useModalState<PhotoModalState>({
      show: false,
      title: "",
      url: "",
    });
  const { albumId } = useParams();

  const { data: photosApi } = useFetch<PhotoModel[]>(`photos?_limit=100`);

  const photos = useMemo(() => {
    if (!photosApi || !albumId) return [];

    return photosApi.filter((photo) => photo.albumId === +albumId);
  }, [photosApi, albumId]);

  const handleClosePhotoPreviewModal = () => {
    closePhotoModal();
    updatePhotoModalState({ url: "", title: "" });
  };

  const handleOpenPhotoPreviewModal = (url: string, title: string) => {
    updatePhotoModalState({ show: true, url, title });
  };

  return (
    <>
      <PhotoPreviewModal
        url={photoModalState.url}
        title={photoModalState.title}
        onClose={handleClosePhotoPreviewModal}
        show={photoModalState.show}
      />
      <ImageList sx={{ width: "80%", m: "auto", py: "2rem" }} cols={3}>
        {photos.map((photo) => (
          <ImageListItem
            key={photo.id}
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpenPhotoPreviewModal(photo.url, photo.title)}
          >
            <img src={photo.url} alt={photo.title} loading="lazy" />
            <ImageListItemBar title={photo.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
