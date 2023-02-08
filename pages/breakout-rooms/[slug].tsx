import { FC } from "react";
import Link from "next/link";
import Layout from "components/Templates/Layout";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { BsChevronRight } from "react-icons/bs";

import withAuth from "@/utils/withAuth";
import BreakoutSessionForm from "@/components/Organisms/BreakoutSessionForm";

const BreakoutRoomDetail: FC = () => {
  return (
    <Layout title="Breakout Room Detail | Zodiac Live">
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
              Session
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <BreakoutSessionForm />
      </VStack>
    </Layout>
  );
};

export default withAuth(BreakoutRoomDetail);
