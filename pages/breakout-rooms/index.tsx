import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";

import Layout from "@/components/Templates/Layout";
import BreakoutRoomTable from "@/components/Organisms/BreakoutRoomTable";
import { BG_GRADIENT } from "@/constants/ui";
import BreakoutSessionTable from "@/components/Organisms/BreakoutSessionTable";

type TTabCustom = {
  title: string;
};
const TabCustom: FC<TTabCustom> = ({ title }) => {
  return (
    <Tab
      p="0"
      mr="6"
      color="gray"
      _selected={{
        color: "black",
        fontWeight: "bold",
        borderBottom: "solid 4px transparent",
        background: `linear-gradient(white, white), ${BG_GRADIENT}`,
        backgroundOrigin: "border-box",
        bgClip: "padding-box, border-box",
      }}
    >
      {title}
    </Tab>
  );
};

const BreakoutRoom: FC = () => {
  return (
    <Layout title="Breakout Room | ZodiacLive">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Breakout Room
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Tabs variant="unstyled" width="100%">
          <TabList>
            <TabCustom title="BREAKOUT ROOM LIST" />
            <TabCustom title="BREAKOUT SESSIONS LIST" />
          </TabList>
          <TabPanels>
            <TabPanel p="0" pt="5">
              <BreakoutRoomTable />
            </TabPanel>
            <TabPanel p="0" pt="5">
              <BreakoutSessionTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Layout>
  );
};

export default withAuth(BreakoutRoom);
