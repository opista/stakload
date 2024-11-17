import { FloatingIndicator, Tabs, rem } from "@mantine/core";
import { FC, useState } from "react";
import { IconProps } from "@tabler/icons-react";
import classes from "./VerticalTabs.module.css";
import { useTranslation } from "react-i18next";
import { ParseKeys } from "i18next";

export interface Tab {
  Content: () => JSX.Element;
  Icon: FC<IconProps>;
  key: string;
  label: ParseKeys;
}

interface VerticalTabsProps {
  defaultTab: string;
  tabs: Tab[];
}

export const VerticalTabs = ({ defaultTab, tabs }: VerticalTabsProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

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
        {tabs.map(({ Icon, key, label }) => (
          <Tabs.Tab
            className={classes.tab}
            classNames={{
              tabLabel: classes.tabLabel,
              tabSection: classes.tabSection,
            }}
            key={key}
            leftSection={<Icon style={iconStyle} />}
            ref={setControlRef(key)}
            value={key}
          >
            {t(label)}
          </Tabs.Tab>
        ))}

        <FloatingIndicator
          className={classes.indicator}
          parent={rootRef}
          target={activeTab ? controlsRefs[activeTab] : null}
        />
      </Tabs.List>

      {tabs.map(({ Content, key }) => (
        <Tabs.Panel className={classes.tabPanel} key={key} value={key}>
          <Content />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
