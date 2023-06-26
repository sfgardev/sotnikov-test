import CommentIcon from "@mui/icons-material/Comment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
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
import { useEffect, useState } from "react";
import { deletePost } from "../../api/deletePost";
import { useFetch } from "../../hooks/useFetch";
import BasicModal, { PostEditState } from "../modals/PostEditModal";
import { PostModel, UserModel } from "./types";

export type PostWithAdditionalInfo = PostModel & {
  username: string;
  isSelected: boolean;
  isFavorite: boolean;
};

export default function Posts() {
  const [posts, setPosts] = useState<PostWithAdditionalInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [postEditState, setPostEditState] = useState<PostEditState>({
    id: -1,
    username: "",
    title: "",
    body: "",
  });

  const { data: postsApi, isLoading: postsLoading } =
    useFetch<PostModel[]>("posts");
  const { data: usersApi, isLoading: usersLoading } =
    useFetch<UserModel[]>("users");

  useEffect(() => {
    if (!postsApi || !usersApi) return;

    const userNamesByIdsMap = new Map<number, UserModel>();
    for (const user of usersApi) {
      if (userNamesByIdsMap.has(user.id)) continue;
      userNamesByIdsMap.set(user.id, user);
    }

    const postsByUserIds = postsApi.map((post) => {
      const user = userNamesByIdsMap.get(post.userId);

      return {
        ...post,
        username: user?.name || "",
        isSelected: false,
        isFavorite: false,
      };
    });

    setPosts(postsByUserIds);
  }, [postsApi, usersApi]);

  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    post: PostWithAdditionalInfo
  ) => {
    e.stopPropagation();
    const { id, username, title, body } = post;
    setPostEditState({ id, username, title, body });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSelect = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isSelected: !post.isSelected,
            }
          : post
      )
    );
  };

  const handleAddToFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: number
  ) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isFavorite: !post.isFavorite,
            }
          : post
      )
    );
  };

  const handleConfirmEdit = (editedPost: PostEditState) => {
    const { id, ...etc } = editedPost;
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...etc } : post))
    );
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: number
  ) => {
    e.stopPropagation();
    deletePost(postId);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (postsLoading || usersLoading) return <CircularProgress />;

  return (
    <>
      <BasicModal
        open={open}
        postEditState={postEditState}
        onClose={handleClose}
        onConfirm={handleConfirmEdit}
      />
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {posts.map((post) => {
          const labelId = `checkbox-list-label-${post.id}`;

          return (
            <ListItem key={post.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => handleSelect(post.id)}
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
                          <IconButton aria-label="comments">
                            <CommentIcon />
                          </IconButton>
                          <IconButton
                            aria-label="favorites"
                            onClick={(e) => handleAddToFavorite(e, post.id)}
                          >
                            {post.isFavorite ? (
                              <FavoriteIcon />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => handleOpen(e, post)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => handleDelete(e, post.id)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Box>
                  }
                  secondary={post.body}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
