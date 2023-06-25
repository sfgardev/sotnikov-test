import Posts from "../components/Posts/Posts";
import { Tab } from "../components/Tabs/types";

export const tabs: Tab[] = [
  {
    label: "Posts",
    content: <Posts />,
  },
  {
    label: "Photos",
    content: <span>Photos</span>,
  },
  {
    label: "Todos",
    content: <span>Todos</span>,
  },
];
