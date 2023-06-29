import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
    Box,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import useFilters from "../../hooks/useFilters";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useModalState } from "../../hooks/useModalState";
import { usePagination } from "../../hooks/usePagination";
import { useSet } from "../../hooks/useSet";
import useSorting from "../../hooks/useSorting";
import Filters from "../Filters";
import ListWithCheckbox from "../ListWithCheckbox";
import { UserModel } from "../Posts/types";
import SelectPagination from "../SelectPagination";
import Sorting, { SortBy, SortByItem } from "../Sorting";
import ConfirmationModal from "../modals/ConfirmationModal";
import {
    AddToFavoritesConfirmationModalState,
    AlbumDeleteConfirmationModalState,
    AlbumModel,
} from "./types";

const photosSortByItems: SortByItem[] = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
  { value: "username", label: "User name" },
  { value: "isFavorite", label: "Favorites" },
];

type AlbumWithUserName = AlbumModel & {
  username: string;
};

export default function Photos() {
  const [albums, setAlbums] = useState<AlbumWithUserName[]>([]);
  const [favoriteAlbumsIds, setFavoriteAlbumsIds] = useLocalStorage<number[]>(
    "favoriteAlbumsIds",
    []
  );
  const [selectedAlbumsIdsSet, selectedAlbumsIdsSetActions] = useSet<number>(
    []
  );

  const [, favoritesAlbumsIdsSetActions] = useSet<number>(favoriteAlbumsIds);

  const { data: albumsApi, isLoading: albumsLoading } =
    useFetch<AlbumModel[]>("albums");
  const { data: usersApi, isLoading: usersLoading } =
    useFetch<UserModel[]>("users");

  const [
    albumDeleteConfirmationModalState,
    closeAlbumDeleteConfirmationModal,
    updateAlbumDeleteConfirmationModalState,
  ] = useModalState<AlbumDeleteConfirmationModalState>({
    show: false,
    albumId: -1,
  });

  const [
    addToFavoritesModalState,
    closeAddToFavoritesModal,
    updateAddToFavoritesModalState,
  ] = useModalState<AddToFavoritesConfirmationModalState>({
    show: false,
  });

  const {
    itemsNumberPerPage: photosNumberPerPage,
    handleChangeItemsNumberPerPage,
  } = usePagination("photosCountOnPage");

  const {
    search,
    isFavorites,
    selectedUsersFilter,
    handleFilterByUsers,
    handleSearch,
    handleToggleFilterByFavorites,
  } = useFilters();

  const {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  } = useSorting<SortBy>();

  useEffect(() => {
    if (!albumsApi || !usersApi) return;

    const usersByIdsMap = new Map<number, UserModel>();
    const favoriteAlbumsIdsSet = new Set([...favoriteAlbumsIds]);

    for (const user of usersApi) {
      if (usersByIdsMap.has(user.id)) continue;
      usersByIdsMap.set(user.id, user);
    }

    const albumsWithUsername = albumsApi.map((album) => {
      const user = usersByIdsMap.get(album.userId);

      return {
        ...album,
        username: user?.name || "",
        isFavorite: favoriteAlbumsIdsSet.has(album.id),
      };
    });

    setAlbums(albumsWithUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumsApi, usersApi]);

  const filteredAlbums = useMemo(() => {
    if (!search && selectedUsersFilter.length === 0 && !isFavorites) {
      return albums;
    }
    let newAlbums = [...albums];
    if (search) {
      newAlbums = newAlbums.filter((album) =>
        album.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedUsersFilter.length > 0) {
      newAlbums = newAlbums.filter((album) =>
        selectedUsersFilter.includes(album.username)
      );
    }
    if (isFavorites) {
      newAlbums = newAlbums.filter((album) =>
        favoritesAlbumsIdsSetActions.has(album.id)
      );
    }
    return newAlbums;
  }, [
    search,
    selectedUsersFilter,
    albums,
    isFavorites,
    favoritesAlbumsIdsSetActions,
  ]);

  const sortedAlbums = useMemo(() => {
    if (sortDirection === "" || sortBy === "") {
      return filteredAlbums;
    }

    const newAlbums = [...filteredAlbums];

    newAlbums.sort((a, b) => {
      const value1 = a[sortBy];
      const value2 = b[sortBy];

      if (typeof value1 === "string" && typeof value2 === "string") {
        return sortDirection === "asc"
          ? value1.localeCompare(value2)
          : value2.localeCompare(value1);
      }

      if (typeof value1 === "number" && typeof value2 === "number") {
        return sortDirection === "asc" ? value1 - value2 : value2 - value1;
      }

      if (typeof value1 === "boolean" && typeof value2 === "boolean") {
        return sortDirection === "desc" ? +value1 - +value2 : +value2 - +value1;
      }

      return 0;
    });

    return newAlbums;
  }, [filteredAlbums, sortDirection, sortBy]);

  const handleSelectAlbum = (albumId: number) => {
    selectedAlbumsIdsSetActions.has(albumId)
      ? selectedAlbumsIdsSetActions.delete(albumId)
      : selectedAlbumsIdsSetActions.add(albumId);
  };

  const handleAddToFavoriteSelected = () => {
    selectedAlbumsIdsSetActions.each((selectedAlbumId) => {
      favoritesAlbumsIdsSetActions.add(selectedAlbumId);
    });
  };

  const handleDeleteSelected = () => {
    setAlbums((prev) =>
      prev.filter((album) => !selectedAlbumsIdsSet.has(album.id))
    );
  };

  const handleDeleteAlbum = (albumId: number) => {
    setAlbums((prev) => prev.filter((album) => album.id !== albumId));
  };

  const handleAlbumDeleteConfirmationModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    albumId: number
  ) => {
    e.stopPropagation();
    updateAlbumDeleteConfirmationModalState({ show: true, albumId });
  };

  const handleAddToFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    albumId: number
  ) => {
    e.stopPropagation();

    setFavoriteAlbumsIds((prev) =>
      favoritesAlbumsIdsSetActions.has(albumId)
        ? prev.filter((favAlbumId) => favAlbumId !== albumId)
        : [...prev, albumId]
    );

    favoritesAlbumsIdsSetActions.has(albumId)
      ? favoritesAlbumsIdsSetActions.delete(albumId)
      : favoritesAlbumsIdsSetActions.add(albumId);
  };

  const userNames = (usersApi ?? []).map((user) => user.name);

  if (!albumsApi || !usersApi || albumsLoading || usersLoading) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}
      />
    );
  }
  return (
    <>
      <SelectPagination
        itemsPerPage={photosNumberPerPage}
        onChangeItemsPerPage={handleChangeItemsNumberPerPage}
      />
      <ConfirmationModal
        open={albumDeleteConfirmationModalState.show}
        text={"Are you sure you want to delete?"}
        onClose={closeAlbumDeleteConfirmationModal}
        onConfirm={() => {
          selectedAlbumsIdsSet.size > 0
            ? handleDeleteSelected()
            : handleDeleteAlbum(albumDeleteConfirmationModalState.albumId);

          updateAlbumDeleteConfirmationModalState({
            show: false,
          });
        }}
      />
      <ConfirmationModal
        open={addToFavoritesModalState.show}
        text={"Are you sure you want to add to favorites?"}
        onClose={closeAddToFavoritesModal}
        onConfirm={() => {
          handleAddToFavoriteSelected();
          updateAddToFavoritesModalState({ show: false });
        }}
      />
      <Sorting
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortByItems={photosSortByItems}
        onChangeSortBy={handleChangeSortBy}
        onChangeSortDirection={handleChangeSortDirection}
      />
      <Filters
        search={search}
        userNames={userNames}
        isFavorites={isFavorites}
        selectedUsersFilter={selectedUsersFilter}
        onSearch={handleSearch}
        onFilter={handleFilterByUsers}
        onToggleFilterByFavorites={handleToggleFilterByFavorites}
      />
      <ListWithCheckbox
        items={sortedAlbums}
        selectedItemsSet={selectedAlbumsIdsSet}
        renderPrimary={(album) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              to={`${generatePath("/album/:albumId", {
                albumId: album.id.toString(),
              })}`}
            >
              <Typography fontWeight={700}>{album.title}</Typography>
            </Link>
            <Box>
              {/* <IconButton aria-label="edit" onClick={() => undefined}>
                <EditIcon />
              </IconButton> */}
              <IconButton
                aria-label="favorites"
                onClick={(e) => handleAddToFavorite(e, album.id)}
              >
                {favoritesAlbumsIdsSetActions.has(album.id) ? (
                  <FavoriteIcon color="primary" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={(e) => handleAlbumDeleteConfirmationModal(e, album.id)}
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            </Box>
          </Stack>
        )}
        renderSecondary={(album) => album.username}
        onSelectItem={handleSelectAlbum}
        onOpenAddToFavoriteConfirmationModal={() =>
          updateAddToFavoritesModalState({ show: true })
        }
        onOpenDeleteConfirmationItemModal={() =>
          updateAlbumDeleteConfirmationModalState({ show: true })
        }
      />
    </>
  );
}
