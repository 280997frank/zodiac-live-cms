import React, { FC, useState, useEffect } from "react";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Stack,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";
import { Form, Formik } from "formik";
import Layout from "@/components/Templates/Layout";
import { SocialWallFormInitialValue } from "@/constants/form";
import { BG_GRADIENT } from "@/constants/ui";
import TextInput from "@/components/Atoms/TextInput";
import { LinkIcon } from "@/components/Atoms/Icons";
import { useSocialWall, useMutationSocialWall } from "@/hooks/socialWall";
import { isEmpty } from "lodash";
import { isNil } from "lodash";
import { object } from "yup";
import { optionalUrl } from "@/constants/validationSchema";

const validationSchema = object({
  url: optionalUrl,
});

const SocialWall: FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(
    SocialWallFormInitialValue
  );
  const {
    fetchSocialWall,
    loading: isFetchingSocialWall,
    data: socialWallRes,
  } = useSocialWall();

  const {
    fetchMutationSocialWall,
    loading: isFetchingMutationSocialwall,
    data: socialWallMutation,
  } = useMutationSocialWall();

  useEffect(() => {
    fetchSocialWall();
  }, [fetchSocialWall]);

  useEffect(() => {
    if (
      !isEmpty(socialWallRes?.getSocialWall) &&
      !isEmpty(socialWallRes) &&
      !isNil(socialWallRes?.getSocialWall) &&
      !isNil(socialWallRes)
    ) {
      setInitialValues(socialWallRes.getSocialWall);
    }
  }, [socialWallRes]);
  console.log("socialWallRes", socialWallRes);
  return (
    <Layout title="Social Wall | ZodiacLive CMS">
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
              Social Wall
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            setSubmitting(true);
            fetchMutationSocialWall({
              variables: {
                setSocialWallInput: {
                  url: values.url,
                },
              },
            });
            // console.log("values", values);
            setSubmitting(false);
          }}
        >
          {({ resetForm }) => (
            <Form style={{ width: "100%" }}>
              <Stack
                direction={["column", "row"]}
                align="flex-start"
                spacing="10"
              >
                <TextInput
                  id="socialwall"
                  name="url"
                  label="SOCIAL WALL IFRAME URL"
                  placeholder="Social Wall iframe URL"
                  LeftElement={<LinkIcon withGradient boxSize={6} />}
                />
              </Stack>
              <ButtonGroup mt="8">
                <Button
                  bgImage={BG_GRADIENT}
                  color="white"
                  isLoading={
                    isSubmitting ||
                    isFetchingSocialWall ||
                    isFetchingMutationSocialwall
                  }
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => resetForm()}
                  variant="outline"
                  isLoading={
                    isSubmitting ||
                    isFetchingSocialWall ||
                    isFetchingMutationSocialwall
                  }
                  color="gray.500"
                  bg="white"
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </VStack>
    </Layout>
  );
};

export default withAuth(SocialWall);
