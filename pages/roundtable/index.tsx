import React, { FC } from "react";
import { NextPage } from "next";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "utils/withAuth";

import RoundtableTable from "components/Organisms/RoundtableTable";
import Layout from "components/Templates/Layout";

const RoundtablePage: NextPage = () => {
  return (
    <Layout title="Roundtable | ZodiacLive">
      <VStack
        align="flex-start"
        minHeight="100vh"
        padding={["7", "10"]}
        position="relative"
      >
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Roundtable
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <RoundtableTable />
      </VStack>
    </Layout>
  );
};

export default withAuth(RoundtablePage);
