import Photos from "../components/Photos";
import Posts from "../components/Posts";
import Todos from "../components/Todos";
import { Tab } from "../components/Tabs/types";

export const tabs: Tab[] = [
  {
    label: "Posts",
    content: <Posts />,
  },
  {
    label: "Photos",
    content: <Photos />,
  },
  {
    label: "Todos",
    content: <Todos />,
  },
];
