import { Paper, Title } from "@mantine/core";
import { ReactNode } from "react";

import classes from "./ContentCard.module.css";

type ContentCardProps = {
  children: ReactNode;
  title?: ReactNode;
};

export const ContentCard = ({ children, title }: ContentCardProps) => (
  <Paper classNames={{ root: classes.container }}>
    {title && (
      <Title classNames={{ root: classes.title }} order={2}>
        {title}
      </Title>
    )}
    {children}
  </Paper>
);
