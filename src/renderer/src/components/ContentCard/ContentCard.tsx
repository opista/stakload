import { Paper, Title } from "@mantine/core";
import { ReactNode } from "react";

import classes from "./ContentCard.module.css";

type ContentCardProps = {
  content: ReactNode;
  title: ReactNode;
};

export const ContentCard = ({ content, title }: ContentCardProps) => (
  <Paper classNames={{ root: classes.container }}>
    <Title classNames={{ root: classes.title }} order={2}>
      {title}
    </Title>
    {content}
  </Paper>
);
