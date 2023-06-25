import { useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { PostModel, UserModel } from "./types";
import {
  Box,
  Checkbox,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Posts() {
  // const [posts, setPosts] = useState([]);

  const { data: posts, error, isLoading } = useFetch<PostModel[]>("posts");
  const { data: users } = useFetch<UserModel[]>("users");

  const postsByUser = useMemo(() => {
    if (!posts || !users) return [];

    const userNamesByIdsMap = new Map<number, UserModel>();
    for (const user of users) {
      if (userNamesByIdsMap.has(user.id)) continue;
      userNamesByIdsMap.set(user.id, user);
    }

    return posts.map((post) => {
      const user = userNamesByIdsMap.get(post.userId);

      return { ...post, username: user?.name || "" };
    });
  }, [posts, users]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {postsByUser.map((post) => {
        const labelId = `checkbox-list-label-${post.id}`;

        return (
          <ListItem key={post.id} disablePadding>
            <ListItemButton
              role={undefined}
              // onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  // checked={checked.indexOf(value) !== -1}
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

                        <IconButton aria-label="favorites">
                          <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
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
  );
}
