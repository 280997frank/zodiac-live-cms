import React, { FC, ReactElement } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import VodTable from "@/components/Organisms/VodTable";

const VideoOnDemand: FC = (): ReactElement => {
  return (
    <Layout title="Auditorium | ZodiacLive">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          width="100%"
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Video on Demand
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <VodTable />
      </VStack>
    </Layout>
  );
};

export default VideoOnDemand;
