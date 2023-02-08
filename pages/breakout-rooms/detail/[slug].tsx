import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";

import Layout from "@/components/Templates/Layout";
import BreakoutRoomDetailTable from "@/components/Organisms/BreakoutRoomDetailTable";
import Link from "next/link";
import { BG_GRADIENT } from "@/constants/ui";
import BreakoutRoomDetailForm from "@/components/Organisms/BreakoutRoomDetailForm";
import { useRouter } from "next/router";
import { useGetLocation } from "@/hooks/breakoutrooms";
import { useEffect } from "react";

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
const BreakoutRoomDetail: FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { fetchLocation, data: location } = useGetLocation();

  useEffect(() => {
    if (slug !== undefined && slug !== null) {
      fetchLocation({
        variables: {
          id: slug,
        },
      });
    }
  }, [fetchLocation, slug]);

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
            <BreadcrumbLink>
              <Link href="/breakout-rooms" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Breakout Room
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              {location !== undefined &&
                location !== null &&
                location.getLocation.name}
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Tabs variant="unstyled" width="100%">
          <TabList>
            <TabCustom title="ROOM DETAILS" />
            <TabCustom title="ROOM SESSIONS LIST" />
          </TabList>
          <TabPanels>
            <TabPanel p="0" pt="5">
              {location !== undefined && location !== null && (
                <BreakoutRoomDetailForm
                  id={location.getLocation.id}
                  name={location.getLocation.name}
                  locationMediaUrl={location.getLocation.locationMediaUrl}
                />
              )}
            </TabPanel>
            <TabPanel p="0" pt="5">
              <BreakoutRoomDetailTable
                id={
                  location?.getLocation !== undefined
                    ? location.getLocation.id
                    : ""
                }
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Layout>
  );
};

export default withAuth(BreakoutRoomDetail);
