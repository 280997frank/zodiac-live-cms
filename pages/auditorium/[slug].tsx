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

import AuditoriumForm from "@/components/Organisms/AuditoriumForm";
import withAuth from "@/utils/withAuth";

const AuditoriumDetail: FC = () => {
  return (
    <Layout title="Auditorium Form | Zodiac Live">
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
              <Link href="/auditorium" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Auditorium
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
        <AuditoriumForm />
      </VStack>
    </Layout>
  );
};

export default withAuth(AuditoriumDetail);
