import { FC, ReactElement } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import { BreadcrumbLink } from "@chakra-ui/breadcrumb";
import Link from "next/link";
import Layout from "@/components/Templates/Layout";
import VodForm from "@/components/Organisms/VodForm";

const VodDetails: FC = (): ReactElement => {
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
              <Link href="/vod" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Video on Demand
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
        <VodForm />
      </VStack>
    </Layout>
  );
};
export default VodDetails;
