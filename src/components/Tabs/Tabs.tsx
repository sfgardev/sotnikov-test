import Box from "@mui/material/Box";
import MuiTab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import * as React from "react";
import { Tab } from "./types";
import { TabPanel } from "./TabPanel";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [value, setValue] = useLocalStorage("activeTab", 0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MuiTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab, tabIndex) => (
            <MuiTab key={tabIndex} label={tab.label} {...a11yProps(tabIndex)} />
          ))}
        </MuiTabs>
      </Box>
      {tabs.map((tab, tabIndex) => (
        <TabPanel key={tabIndex} value={value} index={tabIndex}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}
