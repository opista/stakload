import { Paper, Title } from "@mantine/core";
import { ReactNode } from "react";

import classes from "./ContentCard.module.css";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
};

export const ContentCard = ({ children, className, title }: ContentCardProps) => (
  <Paper className={className} classNames={{ root: classes.container }} radius="lg">
    {title && (
      <Title classNames={{ root: classes.title }} order={2}>
        {title}
      </Title>
    )}
    {children}
  </Paper>
);
