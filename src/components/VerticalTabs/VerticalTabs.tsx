import { rem, Tabs, FloatingIndicator } from "@mantine/core";
import { FunctionComponent, ReactNode, useState } from "react";
import classes from "./VerticalTabs.module.css";
import { IconProps } from "@tabler/icons-react";

type Tab = {
  content: ReactNode;
  icon: FunctionComponent<IconProps>;
  key: string;
  label: string;
};

type VerticalTabsProps = {
  defaultTab: string;
  tabs: Tab[];
};

export const VerticalTabs = ({ defaultTab, tabs }: VerticalTabsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});

  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs
      activateTabWithKeyboard
      className={classes.tabs}
      keepMounted={false}
      onChange={setActiveTab}
      orientation="vertical"
      value={activeTab}
    >
      <Tabs.List ref={setRootRef}>
        {tabs.map(({ icon: Icon, key, label }) => (
          <Tabs.Tab
            className={classes.tab}
            key={key}
            leftSection={<Icon style={iconStyle} />}
            ref={setControlRef(key)}
            value={key}
          >
            {label}
          </Tabs.Tab>
        ))}

        <FloatingIndicator
          target={activeTab ? controlsRefs[activeTab] : null}
          parent={rootRef}
          className={classes.indicator}
        />
      </Tabs.List>

      {tabs.map(({ content, key }) => (
        <Tabs.Panel className={classes.tabPanel} key={key} value={key}>
          {content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
