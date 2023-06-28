export type AlbumModel = {
  id: number;
  userId: number;
  title: string;
};

export type AlbumDeleteConfirmationModalState = {
  show: boolean;
  albumId: number;
};
export type AddToFavoritesConfirmationModalState = {
  show: boolean;
};
