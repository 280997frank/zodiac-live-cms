import React, { FC, useEffect, useState } from "react";
import { FieldArray, Form, Formik } from "formik";
import { Box, Flex, Stack, VStack } from "@chakra-ui/layout";
import { Spacer } from "@chakra-ui/react";
import TextInput from "@/components/Atoms/TextInput";
import RemoveButton from "@/components/Atoms/RemoveButton";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { BG_GRADIENT } from "@/constants/ui";
import { array, object } from "yup";
import { requiredString, requiredUrl } from "@/constants/validationSchema";
import { MdPictureAsPdf } from "react-icons/md";
import { BiVideo } from "react-icons/bi";
import { RequestEditResourceCenterGeneral } from "@/types/resource-center";
import {
  useDetailResourceCenterGeneral,
  useEditResourceCenterGeneral,
} from "@/hooks/resource-center";

const rcFormValidation = object({
  pdfUrl: array().of(
    object().shape({
      name: requiredString,
      url: requiredUrl,
    })
  ),
  videoUrl: array().of(
    object().shape({
      name: requiredString,
      url: requiredUrl,
    })
  ),
});

const ResourceCenterGeneralForm: FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialForm, setInitialForm] =
    useState<RequestEditResourceCenterGeneral>({
      pdfUrl: [
        {
          url: "",
          name: "",
        },
      ],
      videoUrl: [
        {
          url: "",
          name: "",
        },
      ],
    });

  // === Get Detail General Resource Center =====
  const {
    fetchGeneralResourceCenter,
    loading: isLoadingDetail,
    data: dataGeneralResourceCenter,
  } = useDetailResourceCenterGeneral({});

  useEffect(() => {
    fetchGeneralResourceCenter();
  }, [fetchGeneralResourceCenter]);

  useEffect(() => {
    if (dataGeneralResourceCenter) {
      setInitialForm(dataGeneralResourceCenter?.detailResourceCenterGeneral);
    }
  }, [dataGeneralResourceCenter]);

  // === Edit General Resource Center ===
  const {
    fetchEditResourceCenterGeneral,
    loading: isLoadingEditRC,
    data: dataEdit,
  } = useEditResourceCenterGeneral();

  return (
    <Formik
      enableReinitialize
      validationSchema={rcFormValidation}
      initialValues={initialForm}
      onSubmit={(val) => {
        console.log(val);
        fetchEditResourceCenterGeneral({
          variables: {
            editResourceCenterInput: {
              pdfUrl: val.pdfUrl,
              videoUrl: val.videoUrl,
            },
          },
        });
      }}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form style={{ width: "100%" }}>
            <Stack
              direction={["column", "row"]}
              align="flex-start"
              spacing="10"
            >
              <VStack spacing="6" w={["100%", "75%"]}>
                <Stack
                  direction={["row"]}
                  align="flex-start"
                  spacing="10"
                  width="100%"
                >
                  <VStack spacing="6" w={["100%", "100%"]}>
                    <Stack width="100%">
                      <FieldArray name="pdfUrl">
                        {({ remove, push }) => (
                          <Flex flexDirection="column" width="100%">
                            <Flex>
                              <Box p="4" paddingLeft="0px">
                                <label style={{ fontWeight: "bold" }}>
                                  PDF RESOURCE URL
                                </label>
                              </Box>
                              <Spacer />
                              <Box p="4">
                                <button
                                  type="button"
                                  onClick={() => push({ url: "" })}
                                >
                                  +
                                </button>
                              </Box>
                            </Flex>
                            <div>
                              {values.pdfUrl.length > 0 &&
                                values.pdfUrl.map((val, index) => (
                                  <Stack key={index}>
                                    <Flex key={index} flexDirection="row">
                                      <Stack width="100%">
                                        <TextInput
                                          name={`pdfUrl[${index}].name`}
                                          label=""
                                          id={`pdfUrl[${index}].name`}
                                          placeholder="Resource Name"
                                        />
                                        <TextInput
                                          LeftElement={
                                            <MdPictureAsPdf
                                              style={{ fill: "url(#lgrad)" }}
                                            />
                                          }
                                          name={`pdfUrl[${index}].url`}
                                          label=""
                                          id={`pdfUrl[${index}].url`}
                                          placeholder="PDF URL"
                                        />
                                      </Stack>
                                      <RemoveButton
                                        onClick={() => remove(index)}
                                      />
                                    </Flex>
                                    <Flex flexDirection="row"></Flex>
                                  </Stack>
                                ))}
                            </div>
                          </Flex>
                        )}
                      </FieldArray>
                    </Stack>
                  </VStack>
                  <VStack spacing="6" w={["100%", "100%"]}>
                    <Stack width="100%">
                      <FieldArray name="videoUrl">
                        {({ remove, push }) => (
                          <Flex flexDirection="column" width="100%">
                            <Flex>
                              <Box p="4" paddingLeft="0px">
                                <label style={{ fontWeight: "bold" }}>
                                  PDF RESOURCE URL
                                </label>
                              </Box>
                              <Spacer />
                              <Box p="4">
                                <button
                                  type="button"
                                  onClick={() => push({ url: "" })}
                                >
                                  +
                                </button>
                              </Box>
                            </Flex>
                            <div>
                              {values.videoUrl.length > 0 &&
                                values.videoUrl.map((val, index) => (
                                  <Stack key={index}>
                                    <Flex flexDirection="row">
                                      <Stack width="100%">
                                        <TextInput
                                          name={`videoUrl[${index}].name`}
                                          label=""
                                          id={`videoUrl[${index}].name`}
                                          placeholder="Resource Name"
                                        />
                                        <TextInput
                                          LeftElement={
                                            <BiVideo
                                              style={{ fill: "url(#lgrad)" }}
                                            />
                                          }
                                          name={`videoUrl[${index}].url`}
                                          label=""
                                          id={`videoUrl[${index}].url`}
                                          placeholder="VIDEO URL"
                                        />
                                      </Stack>
                                      <RemoveButton
                                        onClick={() => remove(index)}
                                      />
                                    </Flex>
                                    <Flex flexDirection="row"></Flex>
                                  </Stack>
                                ))}
                            </div>
                          </Flex>
                        )}
                      </FieldArray>
                    </Stack>
                  </VStack>
                </Stack>
              </VStack>
            </Stack>
            <ButtonGroup mt="8">
              <Button
                bgImage={BG_GRADIENT}
                color="white"
                isLoading={isSubmitting}
                type="submit"
              >
                Save Changes
              </Button>
              <Button variant="outline" color="gray.500" bg="white">
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ResourceCenterGeneralForm;
