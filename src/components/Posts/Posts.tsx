import CommentIcon from "@mui/icons-material/Comment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { deletePost } from "../../api/deletePost";
import { useFetch } from "../../hooks/useFetch";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePagination } from "../../hooks/usePagination";
import Filters from "../Filters";
import SelectPagiantion from "../SelectPagination";
import Sorting from "../Sorting";
import AddNewPostModal from "../modals/AddNewPostModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import PostEditModal from "../modals/PostEditModal";
import {
  AddNewPostModalState,
  AddToFavoritesConfirmationModalState,
  CommentModel,
  PostDeleteConfirmationModalState,
  PostEditModalState,
  PostEditState,
  PostModel,
  UserModel,
} from "./types";
import useSorting from "../../hooks/useSorting";
import useFilters from "../../hooks/useFilters";
import { useModalState } from "../../hooks/useModalState";

export type PostWithAdditionalInfo = PostModel & {
  comments: CommentModel[];
  username: string;
  isSelected: boolean;
  isFavorite: boolean;
  isCommentsVisible: boolean;
};

export default function Posts() {
  const [posts, setPosts] = useState<PostWithAdditionalInfo[]>([]);

  const [postEditModalState, closePostEditModal, updatePostEditModalState] =
    useModalState<PostEditModalState>({
      show: false,
      body: "",
      id: -1,
      title: "",
      username: "",
    });

  const [
    postDeleteConfirmationModalState,
    closePostDeleteConfirmationModal,
    updatePostDeleteConfirmationModalState,
  ] = useModalState<PostDeleteConfirmationModalState>({
    show: false,
    postId: -1,
  });

  const [
    addToFavoritesModalState,
    closeAddToFavoritesModal,
    updateAddToFavoritesModalState,
  ] = useModalState<AddToFavoritesConfirmationModalState>({
    show: false,
  });

  const [
    addNewPostModalState,
    closeAddNewPostModal,
    updateAddNewPostModalState,
  ] = useModalState<AddNewPostModalState>({
    show: false,
    title: "",
    body: "",
    username: "",
  });

  const [favoritePostsIds, setFavoritePostsIds] = useLocalStorage<number[]>(
    "favoritePostsIds",
    []
  );
  const {
    itemsNumberPerPage: postsNumberPerPage,
    handleChangeItemsNumberPerPage,
  } = usePagination("postsCountOnPage");
  const {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  } = useSorting();
  const {
    search,
    isFavorites,
    selectedUsersFilter,
    handleFilterByUsers,
    handleSearch,
    handleToggleFilterByFavorites,
  } = useFilters();

  const selectedPostIdsRef = useRef(new Set<number>([]));

  const { data: postsApi, isLoading: postsLoading } = useFetch<PostModel[]>(
    `posts?_limit=${postsNumberPerPage}`
  );
  const { data: usersApi, isLoading: usersLoading } =
    useFetch<UserModel[]>("users");
  const { data: commentsApi, isLoading: commentsLoading } =
    useFetch<CommentModel[]>("comments");

  const userNames = (usersApi ?? []).map((user) => user.name);

  useEffect(() => {
    if (!postsApi || !usersApi || !commentsApi) return;

    const usersByIdsMap = new Map<number, UserModel>();
    const commentsByPostIdsMap = new Map<number, CommentModel[]>();
    const favoritePostsIdsSet = new Set([...favoritePostsIds]);

    for (const user of usersApi) {
      if (usersByIdsMap.has(user.id)) continue;
      usersByIdsMap.set(user.id, user);
    }

    for (const comment of commentsApi) {
      const commentsByPostId = commentsByPostIdsMap.get(comment.postId);
      if (commentsByPostId) {
        commentsByPostIdsMap.set(comment.postId, [
          ...commentsByPostId,
          comment,
        ]);
      } else {
        commentsByPostIdsMap.set(comment.postId, [comment]);
      }
    }

    const postsWithCommentsByUserIds = postsApi.map((post) => {
      const user = usersByIdsMap.get(post.userId);
      const comments = commentsByPostIdsMap.get(post.id) ?? [];

      return {
        ...post,
        comments,
        username: user?.name || "",
        isSelected: false,
        isFavorite: favoritePostsIdsSet.has(post.id),
        isCommentsVisible: false,
      };
    });

    setPosts(postsWithCommentsByUserIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsApi, usersApi, commentsApi]);

  const handleOpenPostEditModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    post: PostWithAdditionalInfo
  ) => {
    e.stopPropagation();
    const { id, username, title, body } = post;

    updatePostEditModalState({ show: true, id, username, title, body });
  };

  const handlePostDeleteConfirmationModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: number
  ) => {
    e.stopPropagation();
    updatePostDeleteConfirmationModalState({ show: true, postId });
  };

  const handleAddNewPost = (title: string, body: string, username: string) => {
    if (!usersApi) return;

    const userId = usersApi.find((user) => user.name === username)?.id ?? -1;

    const newPost: PostWithAdditionalInfo = {
      id: Date.now(),
      userId,
      body,
      title,
      username,
      comments: [],
      isFavorite: false,
      isCommentsVisible: false,
      isSelected: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    updateAddNewPostModalState({ show: false });
  };

  const handleSelectPost = (postId: number) => {
    setPosts((prev) => {
      return prev.map((post) => {
        const newIsSelected = !post.isSelected;

        if (post.id === postId) {
          if (newIsSelected) {
            selectedPostIdsRef.current.add(post.id);
          } else {
            selectedPostIdsRef.current.delete(post.id);
          }
        }

        return post.id === postId
          ? {
              ...post,
              isSelected: !post.isSelected,
            }
          : post;
      });
    });
  };

  const handleAddToFavoriteSelected = () => {
    setPosts((prev) => {
      return prev.map((post) => {
        const isSelected = selectedPostIdsRef.current.has(post.id);

        if (isSelected) {
          selectedPostIdsRef.current.delete(post.id);
          return { ...post, isFavorite: true, isSelected: false };
        }

        return post;
      });
    });
  };

  const handleDeleteSelected = () => {
    setPosts((prev) =>
      prev.filter((post) => {
        const isSelected = selectedPostIdsRef.current.has(post.id);

        if (isSelected) {
          selectedPostIdsRef.current.delete(post.id);
          return false;
        }
        return true;
      })
    );
  };

  const handleAddToFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: number
  ) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          setFavoritePostsIds((prev) =>
            post.isFavorite
              ? prev.filter((favPostId) => favPostId !== postId)
              : [...prev, postId]
          );
          return { ...post, isFavorite: !post.isFavorite };
        }
        return post;
      })
    );
  };

  const handleConfirmEdit = (editedPost: PostEditState) => {
    const { id, ...etc } = editedPost;

    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...etc } : post))
    );
    updatePostEditModalState({ show: false });
  };

  const handleDeletePost = (postId: number) => {
    deletePost(postId);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleToggleComments = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: number
  ) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isCommentsVisible: !post.isCommentsVisible }
          : post
      )
    );
  };

  const filteredPosts = useMemo(() => {
    if (!search && selectedUsersFilter.length === 0 && !isFavorites) {
      return posts;
    }
    let newPosts = [...posts];
    if (search) {
      newPosts = newPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedUsersFilter.length > 0) {
      newPosts = newPosts.filter((post) =>
        selectedUsersFilter.includes(post.username)
      );
    }
    if (isFavorites) {
      newPosts = newPosts.filter((post) => post.isFavorite);
    }
    return newPosts;
  }, [search, selectedUsersFilter, posts, isFavorites]);

  const sortedPosts = useMemo(() => {
    if (sortDirection === "" || sortBy === "") {
      return filteredPosts;
    }

    const newPosts = [...filteredPosts];

    newPosts.sort((a, b) => {
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

    return newPosts;
  }, [filteredPosts, sortDirection, sortBy]);

  if (postsLoading || usersLoading || commentsLoading)
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

  return (
    <>
      <SelectPagiantion
        itemsPerPage={postsNumberPerPage}
        onChangeItemsPerPage={handleChangeItemsNumberPerPage}
      />
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => updateAddNewPostModalState({ show: true })}
      >
        Add post
      </Button>
      <Sorting
        sortBy={sortBy}
        sortDirection={sortDirection}
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
      <AddNewPostModal
        open={addNewPostModalState.show}
        userNames={userNames}
        onClose={closeAddNewPostModal}
        onAddNewPost={handleAddNewPost}
      />
      <PostEditModal
        open={postEditModalState.show}
        onClose={closePostEditModal}
        onConfirm={handleConfirmEdit}
        {...postEditModalState}
      />
      <ConfirmationModal
        open={postDeleteConfirmationModalState.show}
        text={"Are you sure you want to delete?"}
        onClose={closePostDeleteConfirmationModal}
        onConfirm={() => {
          selectedPostIdsRef.current.size > 0
            ? handleDeleteSelected()
            : handleDeletePost(postDeleteConfirmationModalState.postId);

          updatePostDeleteConfirmationModalState({
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

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {selectedPostIdsRef.current.size > 0 && (
          <Box>
            <IconButton
              aria-label="favorites"
              onClick={() => {
                updateAddToFavoritesModalState({ show: true });
              }}
            >
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() =>
                updatePostDeleteConfirmationModalState({ show: true })
              }
            >
              <DeleteForeverIcon color="error" />
            </IconButton>
          </Box>
        )}
        {sortedPosts.map((post) => {
          const labelId = `checkbox-list-label-${post.id}`;

          return (
            <ListItem key={post.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => handleSelectPost(post.id)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={post.isSelected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={
                    <Box>
                      <Typography fontWeight={700}>{post.title}</Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>by {post.username}</Typography>
                        <Box>
                          <IconButton
                            aria-label="comments"
                            onClick={(e) => handleToggleComments(e, post.id)}
                          >
                            <CommentIcon
                              color={
                                post.isCommentsVisible ? "primary" : "action"
                              }
                            />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleOpenPostEditModal(e, post)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="favorites"
                            onClick={(e) => handleAddToFavorite(e, post.id)}
                          >
                            {post.isFavorite ? (
                              <FavoriteIcon color="primary" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={(e) =>
                              handlePostDeleteConfirmationModal(e, post.id)
                            }
                          >
                            <DeleteForeverIcon color="error" />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Box>
                  }
                  secondary={
                    <Stack>
                      <Typography>{post.body}</Typography>
                      {post.isCommentsVisible && (
                        <List>
                          {post.comments.map((comment) => (
                            <ListItem key={comment.id}>
                              <ListItemText
                                primary={
                                  <Typography fontWeight={600}>
                                    {comment.name} - {comment.email}
                                  </Typography>
                                }
                                secondary={comment.body}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
