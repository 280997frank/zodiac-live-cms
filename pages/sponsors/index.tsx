import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";

import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import SponsorsTable from "@/components/Organisms/SponsorsTable";

const Sponsors: FC = () => {
  return (
    <Layout title="Sponsors | ZodiacLive">
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
              Sponsors
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <SponsorsTable />
      </VStack>
    </Layout>
  );
};

export default withAuth(Sponsors);
