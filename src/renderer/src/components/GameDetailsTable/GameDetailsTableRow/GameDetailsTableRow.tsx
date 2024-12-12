import { Flex, Text } from "@mantine/core";
import { ReactNode } from "react";

import classes from "./GameDetailsTableRow.module.css";

type GameDetailsTableRowProps = {
  label: string;
  value?: ReactNode | string;
};

export const GameDetailsTableRow = ({ label, value }: GameDetailsTableRowProps) => (
  <Flex justify="space-between">
    <Text>{label}</Text>
    <Text className={classes.value}>{value}</Text>
  </Flex>
);
