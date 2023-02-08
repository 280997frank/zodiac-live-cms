import React, { FC } from "react";
import Layout from "components/Templates/Layout";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { BsChevronRight } from "react-icons/bs";
import Link from "next/link";
import withAuth from "@/utils/withAuth";
import SponsorsForm from "@/components/Organisms/SponsorsForm";

const SponsorDetail: FC = () => {
  return (
    <Layout title="Sponsors Form | Zodiac Live">
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
              <Link href="/sponsors" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Sponsors
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Details
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <SponsorsForm />
      </VStack>
    </Layout>
  );
};

export default withAuth(SponsorDetail);
