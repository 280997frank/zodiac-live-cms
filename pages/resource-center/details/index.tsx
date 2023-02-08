import { FC, ReactElement, useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import { BreadcrumbLink } from "@chakra-ui/breadcrumb";
import Link from "next/link";
import ResourceCenterForm from "@/components/Organisms/ResourceCenterForm";
import { useRouter } from "next/router";

interface RCFormInitial {
  sessionId: any;
  pdfUrl: pdfUrl[];
  videoUrl: videoUrl[];
}

interface pdfUrl {
  url: string;
}

interface videoUrl {
  url: string;
}

const ResourceCenterDetail: FC = (): ReactElement => {
  const router = useRouter();
  const pid = router.query;
  const [dataForm, setDataForm] = useState<RCFormInitial>({
    sessionId: "",
    pdfUrl: [],
    videoUrl: [],
  });

  useEffect(() => {
    setDataForm({
      sessionId: pid ? pid.id : "",
      pdfUrl: [],
      videoUrl: [],
    });
  }, [pid]);

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
              <Link href="/resource-center" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Resource Center
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
        <ResourceCenterForm sessionId={dataForm.sessionId} />
      </VStack>
    </Layout>
  );
};

export default ResourceCenterDetail;
