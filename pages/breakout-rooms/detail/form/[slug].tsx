import BreakoutRoomDetailSessionForm from "@/components/Organisms/BreakoutRoomDetailSessionForm";
import Layout from "@/components/Templates/Layout";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const BreakoutRoomDetailForm: FC = () => {
  const router = useRouter();
  const { slug } = router.query;
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
              <Heading
                onClick={() => {
                  router.back();
                }}
                as="h1"
                size="xl"
                marginBottom="8"
                color="gray.300"
              >
                Breakout Room Detail
              </Heading>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              {slug}
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <BreakoutRoomDetailSessionForm roomId={slug as string} />
      </VStack>
    </Layout>
  );
};

export default BreakoutRoomDetailForm;
