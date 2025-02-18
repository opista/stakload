import { Flex, FlexProps } from "@mantine/core";

import classes from "./SectionHeading.module.css";

export const SectionHeading = (props: FlexProps) => <Flex className={classes.container} {...props} />;
