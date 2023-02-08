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
import { FeedBackFormInitialValue } from "@/constants/form";
import { BG_GRADIENT } from "@/constants/ui";
import TextInput from "@/components/Atoms/TextInput";
import { LinkIcon } from "@/components/Atoms/Icons";
import { useFeedback, useMutationFeedback } from "@/hooks/feedback";
import { isEmpty } from "lodash";
import { isNil } from "lodash";
import { object } from "yup";
import { optionalUrl } from "@/constants/validationSchema";

const validationSchema = object({
  url: optionalUrl,
});

const Feedback: FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(FeedBackFormInitialValue);
  const {
    fetchFeedback,
    loading: isFetchingFeedback,
    data: Feedback,
  } = useFeedback();

  const {
    fetchMutationFeedback,
    loading: isFetchingMutationFeedback,
    data: FeedbackMutation,
  } = useMutationFeedback();

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => {
    if (
      !isEmpty(Feedback?.getFeedback) &&
      !isEmpty(Feedback) &&
      !isNil(Feedback?.getFeedback) &&
      !isNil(Feedback)
    ) {
      setInitialValues(Feedback.getFeedback);
      // console.log("Feedback", Feedback);
    }
  }, [Feedback]);
  // console.log("FeedBackFormInitialValue", FeedBackFormInitialValue);
  return (
    <Layout title="Feedback | ZodiacLive CMS">
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
              Feedback
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            setSubmitting(true);
            fetchMutationFeedback({
              variables: {
                setFeedbackInput: {
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
                  id="feedback"
                  name="url"
                  label="FEEDBACK IFRAME URL"
                  placeholder="Feedback iframe URL"
                  LeftElement={<LinkIcon withGradient boxSize={6} />}
                />
              </Stack>
              <ButtonGroup mt="8">
                <Button
                  bgImage={BG_GRADIENT}
                  color="white"
                  isLoading={
                    isSubmitting ||
                    isFetchingFeedback ||
                    isFetchingMutationFeedback
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
                    isFetchingFeedback ||
                    isFetchingMutationFeedback
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

export default withAuth(Feedback);
