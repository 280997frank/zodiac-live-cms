import React, { FC, useEffect, useState } from "react";
import { FieldArray, Form, Formik } from "formik";
import { Box, Flex, Stack, VStack } from "@chakra-ui/layout";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useAddResourceCenter,
  useDetailResourceCenter,
  useEditResourceCenter,
  useListSession,
} from "@/hooks/resource-center";
import { IoMdPin } from "react-icons/io";
import TextInput from "@/components/Atoms/TextInput";
import RemoveButton from "@/components/Atoms/RemoveButton";
import { array, object } from "yup";
import { requiredString, requiredUrl } from "@/constants/validationSchema";
import { Select } from "@chakra-ui/select";
import { useRouter } from "next/router";
import { Spacer } from "@chakra-ui/react";
import { MdPictureAsPdf } from "react-icons/md";
import { BiVideo } from "react-icons/bi";
import { RequestDataDetailResourceCenter } from "@/types/resource-center";

const rcFormValidation = object({
  sessionId: requiredString,
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

interface RCFormProps {
  sessionId: string;
}

interface InitialFormRC {
  sessionId: string;
  pdfUrl: listUrl[];
  videoUrl: listUrl[];
  sessionLocation: string;
}

interface listUrl {
  name: string;
  url: string;
}

const ResourceCenterForm: FC<RCFormProps> = ({ sessionId }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState<RequestDataDetailResourceCenter>({
    id: "",
  });
  const [initialForm, setInitialForm] = useState<InitialFormRC>({
    sessionId: "",
    pdfUrl: [{ name: "", url: "" }],
    videoUrl: [{ name: "", url: "" }],
    sessionLocation: "",
  });
  const router = useRouter();
  const pid = router.query;
  // ==== Get Detail ====
  useEffect(() => {
    if (pid.id) {
      setIsEdit({
        id: pid.id,
      });
    }
  }, [pid]);

  const {
    fetchDetailResourceCenter,
    loading: isLoadingDetail,
    data: dataDetail,
  } = useDetailResourceCenter({
    detailResourceCenter: {
      id: isEdit.id,
    },
  });

  useEffect(() => {
    if (isEdit.id) {
      fetchDetailResourceCenter();
    }
  }, [fetchDetailResourceCenter, isEdit]);

  useEffect(() => {
    if (dataDetail) {
      setInitialForm({
        sessionId: dataDetail.detailResourceCenter.session.id,
        pdfUrl: dataDetail.detailResourceCenter.pdfUrl,
        videoUrl: dataDetail.detailResourceCenter.videoUrl,
        sessionLocation: dataDetail.detailResourceCenter.session.location.name,
      });
    }
  }, [dataDetail]);

  const {
    fetchListSession,
    loading: isLoadingSession,
    data: dataSession,
  } = useListSession({
    listSessionInput: { page: 1, limit: 1000 },
  });

  useEffect(() => {
    fetchListSession();
  }, [fetchListSession]);

  //==== Add Resource Center =====
  const {
    fetchAddResourceCenter,
    loading: isLoadingAddResourceCenter,
    data: dataResourceCenter,
  } = useAddResourceCenter();

  useEffect(() => {
    if (dataResourceCenter?.addResourceCenter.id) {
      router.back();
    }
  }, [dataResourceCenter, router]);

  //=== Edit Resource Center ====
  const {
    fetchEditResourceCenter,
    loading: isLoadingEditResourceCenter,
    data: dataEditResourceCenter,
  } = useEditResourceCenter();

  useEffect(() => {
    if (dataEditResourceCenter?.editResourceCenter.id) {
      router.back();
    }
  }, [dataEditResourceCenter, router]);

  return (
    <Formik
      enableReinitialize
      validationSchema={rcFormValidation}
      initialValues={initialForm}
      onSubmit={(val) => {
        if (isEdit.id) {
          fetchEditResourceCenter({
            variables: {
              editResourceCenterInput: {
                id: isEdit.id,
                sessionId: val.sessionId,
                pdfUrl: val.pdfUrl.map((val) => {
                  return {
                    name: val.name,
                    url: val.url,
                  };
                }),
                videoUrl: val.videoUrl.map((val) => {
                  return {
                    name: val.name,
                    url: val.url,
                  };
                }),
              },
            },
          });
        } else {
          fetchAddResourceCenter({
            variables: {
              addResourceCenterInput: {
                sessionId: val.sessionId,
                pdfUrl: val.pdfUrl,
                videoUrl: val.videoUrl,
              },
            },
          });
        }
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
                      <label style={{ fontWeight: "bold" }}>SESSION NAME</label>
                      <Select
                        style={{ background: "white" }}
                        id="sessionId"
                        name="sessionId"
                        value={values.sessionId}
                        onChange={(e) => {
                          setFieldValue("sessionId", e.currentTarget.value);
                          dataSession?.listSession.sessions.map(
                            (itemIndex, index) => {
                              if (itemIndex.id === e.currentTarget.value) {
                                setFieldValue(
                                  "sessionLocation",
                                  itemIndex.location
                                    ? itemIndex.location.name
                                    : ""
                                );
                                setFieldValue(
                                  "locationId",
                                  itemIndex.location
                                    ? itemIndex.location.id
                                    : ""
                                );
                              }
                            }
                          );
                        }}
                      >
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        {dataSession?.listSession.sessions.map(
                          (data, index) => {
                            return (
                              <option key={index} value={data.id}>
                                {data.title}
                              </option>
                            );
                          }
                        )}
                      </Select>
                    </Stack>
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
                      <label style={{ fontWeight: "bold" }}>LOCATION</label>
                      <TextInput
                        isReadOnly={true}
                        LeftElement={
                          <IoMdPin style={{ fill: "url(#lgrad)" }} />
                        }
                        name="sessionLocation"
                        label=""
                        id="sessionLocation"
                        placeholder="Session Location"
                      />
                    </Stack>
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

export default ResourceCenterForm;
