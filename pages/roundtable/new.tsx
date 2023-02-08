import { NextPage } from "next";
import NextLink from "next/link";
import Layout from "components/Templates/Layout";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { BsChevronRight } from "react-icons/bs";

import RoundtableForm from "components/Organisms/RoundtableForm";
import withAuth from "utils/withAuth";

const NewRoundtablePage: NextPage = () => {
  return (
    <Layout title="Add New Roundtable Session | Zodiac Live">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <NextLink href="/roundtable" passHref>
              <BreadcrumbLink cursor="pointer" _hover={{ textDecor: "none" }}>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Roundtable
                </Heading>
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Add Session
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <RoundtableForm isNewSession />
      </VStack>
    </Layout>
  );
};

export default withAuth(NewRoundtablePage);
