import React, { FC, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Flex, Stack, VStack } from "@chakra-ui/layout";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { IoMdLink, IoMdPin } from "react-icons/io";
import MediaUpload from "@/components/Atoms/MediaUpload";
import { Select } from "@chakra-ui/select";
import TimePicker from "@/components/Atoms/TimePicker";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { BG_GRADIENT } from "@/constants/ui";
import { useListSession } from "@/hooks/resource-center";
import { timezone } from "@/constants/timezone";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { RiCalendarEventFill } from "react-icons/ri";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { object } from "yup";
import {
  requiredDate,
  requiredString,
  requiredUrl,
} from "@/constants/validationSchema";
import { useAddVod, useEditVod, useGetVodById } from "@/hooks/vod";
import { useRouter } from "next/router";
import { RequestVodById } from "@/types/vod";
import { MediaFolderType } from "@/types/upload";
import { useUploadFile } from "@/hooks/upload";

dayjs.extend(customParseFormat);
const VodFormValidation = object({
  title: requiredString,
  url: requiredUrl,
  session: requiredString,
  sessionDate: requiredDate,
  sessionTime: requiredString,
  sessionDateZoneName: requiredString,
  sessionDateOffset: requiredString,
});

interface VodFormInitialValue {
  title: string;
  url: string;
  logo: File | string;
  session: string;
  sessionDate: Date;
  sessionTime: string;
  sessionDateZoneName: string;
  sessionDateOffset: any;
}

const VodForm: FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialForm, setInitialForm] = useState<VodFormInitialValue>({
    title: "",
    url: "",
    logo: "",
    session: "",
    sessionDate: new Date(),
    sessionTime: "12:00",
    sessionDateZoneName: "(UTC+08:00) Kuala Lumpur, Singapore",
    sessionDateOffset: "",
  });
  const [idEdit, setIdEdit] = useState<RequestVodById>({
    id: null,
  });
  const router = useRouter();
  const pid = router.query;
  const { uploadFile } = useUploadFile();
  //=== check params id ====
  useEffect(() => {
    if (pid.id) {
      setIdEdit({
        id: pid.id,
      });
    }
  }, [pid]);

  // ==== Get Vod By Id ====
  const {
    fetchGetVodById,
    loading: isLoadingGetVodById,
    data: dataGetVodById,
  } = useGetVodById({
    detailVodInput: {
      id: idEdit.id,
    },
  });

  useEffect(() => {
    if (idEdit.id) {
      fetchGetVodById();
    }
  }, [fetchGetVodById, idEdit]);

  useEffect(() => {
    if (dataGetVodById) {
      setInitialForm({
        title: dataGetVodById?.getVodById.title,
        url: dataGetVodById?.getVodById.url,
        logo: dataGetVodById.getVodById.thumbnailUrl,
        session: dataGetVodById.getVodById.session
          ? dataGetVodById.getVodById.session.id
          : "",
        sessionDate: new Date(dataGetVodById.getVodById.sessionDate),
        sessionTime: dayjs(dataGetVodById.getVodById.sessionDate).format(
          "HH:mm"
        ),
        sessionDateZoneName: dataGetVodById.getVodById.sessionDateZoneName,
        sessionDateOffset: dataGetVodById.getVodById.sessionDateOffset,
      });
    }
  }, [dataGetVodById]);

  //=== get list Session ====
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

  //=== Add VOD ====
  const {
    fetchAddVod,
    loading: isLoadingAddVod,
    data: dataAddVod,
  } = useAddVod();

  useEffect(() => {
    if (dataAddVod?.addVod.id) {
      router.back();
    }
  }, [dataAddVod, router]);

  //=== Edit VOD ====
  const {
    fetchEditVod,
    loading: isLoadingEditVod,
    data: dataEditVod,
  } = useEditVod();

  useEffect(() => {
    if (dataEditVod?.editVod.id) {
      router.back();
    }
  }, [dataEditVod, router]);

  return (
    <Formik
      enableReinitialize
      validationSchema={VodFormValidation}
      initialValues={initialForm}
      onSubmit={async (values) => {
        setSubmitting(true);
        const time = values.sessionTime.split(":");
        const date3 = dayjs(values.sessionDate)
          .hour(Number(time[0]))
          .minute(Number(time[1]))
          .toISOString();
        let thumbnailUrl = "";

        // Upload image if type value of logo is file
        if (values.logo instanceof File) {
          // NOTE: upload separately and save the URL
          const uploadResult = await uploadFile({
            variables: {
              uploadFilesInput: {
                file: values.logo,
                folder: MediaFolderType.VOD,
              },
            },
          });
          thumbnailUrl = uploadResult.data?.uploadFile.url || "";
        } else {
          thumbnailUrl = values.logo;
        }
        if (idEdit.id) {
          fetchEditVod({
            variables: {
              editVodInput: {
                id: idEdit.id,
                title: values.title,
                url: values.url,
                session: values.session,
                sessionDate: date3,
                sessionDateOffset: values.sessionDateOffset,
                sessionDateZoneName: values.sessionDateZoneName,
                thumbnailUrl: thumbnailUrl,
              },
            },
          });
        } else {
          fetchAddVod({
            variables: {
              addVodInput: {
                title: values.title,
                url: values.url,
                session: values.session,
                sessionDate: date3,
                sessionDateOffset: values.sessionDateOffset,
                sessionDateZoneName: values.sessionDateZoneName,
                thumbnailUrl: thumbnailUrl,
              },
            },
          });
        }
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "75%"]}>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>VIDEO TITLE</label>
                    <TextInput
                      name="title"
                      label=""
                      id="title"
                      placeholder="Video Title"
                    />
                  </Stack>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>LOCATION</label>
                    <Flex>
                      <IoMdPin
                        style={{
                          fill: "url(#lgrad)",
                          position: "fixed",
                          zIndex: 1,
                          marginLeft: "8px",
                          marginTop: "10px",
                        }}
                      />
                      <Select
                        style={{ background: "white", paddingLeft: "28px" }}
                        id="session"
                        name="session"
                        value={values.session}
                        onChange={(e) => {
                          setFieldValue("session", e.currentTarget.value);
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
                    </Flex>
                  </Stack>
                  <VStack spacing="6" w={["100%", "100%"]}>
                    <Panel label="SESSION DATE">
                      <Stack width="100%">
                        <DayPickerInput
                          format="DD-MM-YYYY"
                          value={values.sessionDate}
                          component={(props: Record<string, unknown>) => {
                            return (
                              <InputGroup>
                                <InputLeftElement
                                  color="gray.300"
                                  fontSize="1.2em"
                                >
                                  <RiCalendarEventFill
                                    style={{ fill: "url(#lgrad)" }}
                                  />
                                </InputLeftElement>
                                <Input {...props} />
                              </InputGroup>
                            );
                          }}
                          onDayChange={(e) => {
                            setFieldValue("sessionDate", e);
                          }}
                        />
                      </Stack>
                      <TimePicker name="sessionTime" label="TIME" />
                      <Select
                        id="sessionDateZoneName"
                        name="sessionDateZoneName"
                        value={values.sessionDateZoneName}
                        onChange={(e) => {
                          timezone.map((zone) => {
                            if (e.currentTarget.value === zone.text) {
                              setFieldValue("sessionDateZoneName", zone.text);
                              setFieldValue("sessionDateOffset", zone.offset);
                            }
                          });
                        }}
                      >
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        {timezone.map((data, index) => {
                          return (
                            <option key={index} value={data.text}>
                              {data.text}
                            </option>
                          );
                        })}
                      </Select>
                    </Panel>
                  </VStack>
                </VStack>
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>VIDEO URL</label>
                    <TextInput
                      LeftElement={<IoMdLink style={{ fill: "url(#lgrad)" }} />}
                      name="url"
                      label=""
                      id="url"
                      placeholder="Video On Demand Url"
                    />
                  </Stack>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "30%"]}>
              <MediaUpload
                name="logo"
                type="image"
                accept="image"
                label="VIDEO THUMBNAIL"
                ratio={100}
              />
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
            <Button
              variant="outline"
              color="gray.500"
              bg="white"
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export default VodForm;
