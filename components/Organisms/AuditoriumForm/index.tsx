import DatePicker from "@/components/Atoms/DatePicker";
import FileInput from "@/components/Atoms/FileInput";
import MediaUpload from "@/components/Atoms/MediaUpload";
import RemoveButton from "@/components/Atoms/RemoveButton";
import RichTextInput from "@/components/Atoms/RichTextInput";
import Select from "@/components/Atoms/Select";
import {
  Option,
  TagInputAutocomplete,
} from "@/components/Atoms/TagInputAutocomplete";
import TextInput from "@/components/Atoms/TextInput";
import TextInputSwitch from "@/components/Atoms/TextInputSwitch";
import TimePicker from "@/components/Atoms/TimePicker";
import Panel from "@/components/Molecules/Panel";
import PanelAction from "@/components/Molecules/PanelAction";
import { AuditoriumInitialValues } from "@/constants/form";
import { timezone } from "@/constants/timezone";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useAuditoriumInsert,
  useAuditoriumUpdate,
  useGetAuditorium,
} from "@/hooks/auditorium";
import { useSettingPageList } from "@/hooks/setting";
import { useUploadFile, useUploadMultipleFile } from "@/hooks/upload";
import { AuditoriumFormInitial } from "@/types/auditorium";
import { TInput } from "@/types/setting";
import { MediaFolderType } from "@/types/upload";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Flex, Stack, VStack } from "@chakra-ui/layout";
import { Switch as ChakraSwitch } from "@chakra-ui/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FieldArray, Form, Formik } from "formik";
import React, { FC, useCallback, useEffect, useState } from "react";
import { IoMdLink } from "react-icons/io";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import s from "shortid";
import { useRouter } from "next/router";
import { object } from "yup";
import {
  requiredFile,
  requiredNumber,
  requiredString,
} from "@/constants/validationSchema";
import { useListUsersByRole } from "@/hooks/users";

const speakers = [
  { label: "WSPDV TAMPAN", value: "60e70eff8118d5b822289068" },
  { label: "jokorezky", value: "60eccf489e911323e4627b44" },
  { label: "asd", value: "60ef23223eeb5d40fb29586f" },
];

const AuditoriumForm: FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  dayjs.extend(customParseFormat);

  const [isLivestreamInputEnabled, setLivestreamInputEnabled] = useState(true);
  const [isSlidoInputEnabled, setSlidoInputEnabled] = useState(true);
  const [isGetstreamInputEnabled, setGetstreamInputEnabled] = useState(true);
  const [initialValues, setInitialValues] = useState<AuditoriumFormInitial>(
    AuditoriumInitialValues
  );

  const [settingList, setSettingList] = useState<TInput[]>([]);
  const [settingId, setSettingId] = useState("");

  const { uploadFile } = useUploadFile();
  const { uploadMultipleFile } = useUploadMultipleFile();
  const { mutationAddAuditorium } = useAuditoriumInsert();
  const { mutationEditAuditorium } = useAuditoriumUpdate();
  const { fetchUsersByRole, data: users } = useListUsersByRole();

  const {
    fetchSettingPageList,
    loading: isFetchingSetting,
    data: settingData,
  } = useSettingPageList();

  const { fetchAuditorium, data: auditoriumSingleData } = useGetAuditorium();

  useEffect(() => {
    if (slug !== undefined && slug !== "new") {
      fetchAuditorium({
        variables: {
          id: slug,
        },
      });
    }
  }, [fetchAuditorium, slug]);

  useEffect(() => {
    if (slug !== undefined && slug !== "new") {
      if (auditoriumSingleData !== undefined) {
        const startDate = dayjs(
          auditoriumSingleData.getSessionById.startDate,
          "YYYY-MM-DDTHH:mm:ss.000Z"
        ).format("DD/MM/YYYY");

        const startTime = dayjs(
          auditoriumSingleData.getSessionById.startDate,
          "YYYY-MM-DDTHH:mm:ss.000Z"
        ).format("HH:mm");

        const endDate = dayjs(
          auditoriumSingleData.getSessionById.endDate,
          "YYYY-MM-DDTHH:mm:ss.000Z"
        ).format("DD/MM/YYYY");

        const endTime = dayjs(
          auditoriumSingleData.getSessionById.endDate,
          "YYYY-MM-DDTHH:mm:ss.000Z"
        ).format("HH:mm");

        setInitialValues({
          ...auditoriumSingleData.getSessionById,
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          timezoneStart: auditoriumSingleData.getSessionById.offsetStart,
          timezoneEnd: auditoriumSingleData.getSessionById.offsetEnd,
        });
      }
    } else {
      setInitialValues(AuditoriumInitialValues);
    }
  }, [auditoriumSingleData, slug]);

  useEffect(() => {
    fetchSettingPageList();
    fetchUsersByRole();
  }, [fetchSettingPageList, fetchUsersByRole]);

  useEffect(() => {
    if (!isFetchingSetting && settingData !== undefined) {
      const interests = settingData.listSettings.settings.filter(
        (item) => item.name === "Interests"
      );
      setSettingList(interests[0].tags);
      setSettingId(interests[0].id);
    }
  }, [isFetchingSetting, settingData]);

  const submitForm = useCallback(
    async (values: AuditoriumFormInitial) => {
      // Thumbnail
      let mediaUrl = "";
      if (values.thumbnailUrl instanceof File) {
        // NOTE: upload separately and save the URL
        const uploadResult = await uploadFile({
          variables: {
            uploadFilesInput: {
              file: values.thumbnailUrl,
              folder: MediaFolderType.AUDITORIUM,
            },
          },
        });
        mediaUrl = uploadResult.data?.uploadFile.url || "";
      } else {
        mediaUrl = values.thumbnailUrl;
      }

      // Resources
      let resourcesURL: { url: string | File }[] = [];
      const uploadedResources = values.resources
        .filter(({ url }) => url instanceof File)
        .map(({ url }) => url);

      values.resources.map(({ url }) => {
        if (typeof url === "string") {
          resourcesURL.push({ url: url });
        }
      });

      if (uploadedResources.length > 0) {
        let multiUploadResult = await uploadMultipleFile({
          variables: {
            uploadFilesInput: {
              files: uploadedResources.map((url) => url as File),
              folder: MediaFolderType.AUDITORIUM,
            },
          },
        });
        // console.log({ multiUploadResult });
        if (
          multiUploadResult.data !== undefined &&
          multiUploadResult.data !== null
        ) {
          multiUploadResult.data.uploadMultiFiles.urls.map((url) =>
            resourcesURL.push({ url: url })
          );
        }
      }
      // console.log({ resourcesURL });

      //Tags
      let tagsString: { id: string }[] = [];
      values.tags.map((tag: Option) => {
        tagsString.push({ id: tag.id });
      });

      //Speakers
      let speakersString: { id: string }[] = [];
      values.speakers.map((speaker: { id: string }) => {
        speakersString.push({ id: speaker.id });
      });

      const startDate = dayjs(
        `${values.startDate}/${values.startTime}`,
        "DD/MM/YYYY/HH:mm"
      ).format(`YYYY-MM-DDTHH:mm:ss.000Z`);

      const endDate = dayjs(
        `${values.endDate}/${values.endTime}`,
        "DD/MM/YYYY/HH:mm"
      ).format(`YYYY-MM-DDTHH:mm:ss.000Z`);

      if (slug !== undefined && slug !== "new") {
        const properValues = {
          id: slug as string,
          locationType: "AUDITORIUM",
          title: values.title,
          description: values.description,
          speakers: speakersString,
          tags: tagsString,
          resources: resourcesURL,
          startDate: startDate,
          offsetStart: values.timezoneStart,
          timezoneNameStart: values.timezoneNameStart,
          endDate: endDate,
          offsetEnd: values.timezoneEnd,
          timezoneNameEnd: values.timezoneNameEnd,
          thumbnailUrl: mediaUrl,
          livestreamUrl: values.livestreamUrl,
          slido: values.slido,
          getStreamId: values.getStreamId,
        };
        console.log({ properValues });
        await mutationEditAuditorium({
          variables: {
            editSessionInput: properValues,
          },
        });
      } else {
        const properValues = {
          locationType: "AUDITORIUM",
          title: values.title,
          description: values.description,
          speakers: speakersString,
          tags: tagsString,
          resources: resourcesURL,
          startDate: startDate,
          offsetStart: values.timezoneStart,
          timezoneNameStart: values.timezoneNameStart,
          endDate: endDate,
          offsetEnd: values.timezoneEnd,
          timezoneNameEnd: values.timezoneNameEnd,
          thumbnailUrl: mediaUrl,
          livestreamUrl: values.livestreamUrl,
          slido: values.slido,
          getStreamId: values.getStreamId,
        };
        console.log({ properValues });
        await mutationAddAuditorium({
          variables: {
            addSessionInput: properValues,
          },
        });
      }
    },
    [
      slug,
      uploadFile,
      uploadMultipleFile,
      mutationEditAuditorium,
      mutationAddAuditorium,
    ]
  );

  const validationSchema = object({
    description: requiredString,
    endDate: requiredString,
    endTime: requiredString,
    startDate: requiredString,
    startTime: requiredString,
    thumbnailUrl: requiredFile,
    timezoneNameEnd: requiredString,
    timezoneNameStart: requiredString,
    timezoneStart: requiredString,
    timezoneEnd: requiredString,
    title: requiredString,
    offsetStart: requiredNumber,
    offsetEnd: requiredNumber,
  });

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "75%"]}>
              <Panel label="SESSION TITLE">
                <TextInput
                  name="title"
                  label=""
                  id="title"
                  placeholder="Session Title"
                />
              </Panel>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Panel label="SESSION DESCRIPTION">
                    <RichTextInput
                      id="description"
                      label=""
                      name="description"
                    />
                  </Panel>
                  <FieldArray name="speakers">
                    {({ remove, push }) => (
                      <PanelAction
                        label="SPEAKER(S)"
                        action={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              push({
                                id: s.generate(),
                                value: "",
                              });
                            }}
                          >
                            +
                          </button>
                        }
                      >
                        <Flex flexDirection="column" width="100%">
                          <Select
                            id={`speakers.0.id`}
                            placeholder="Select Speaker"
                            name={`speakers.0.id`}
                            marginRight="1rem"
                            padding="10px"
                            isCustomField
                            onChange={(e: any) => {
                              setFieldValue(
                                e.currentTarget.name,
                                e.currentTarget.value
                              );
                            }}
                            data={
                              users !== undefined
                                ? users.listByRole.users.map((item) => {
                                    return {
                                      label: item.fullname as string,
                                      value: item.id as string,
                                    };
                                  })
                                : []
                            }
                          />
                          {values.speakers.length > 0 &&
                            values.speakers.map((_, index) => (
                              <Flex
                                key={index + 1}
                                flexDirection="row"
                                padding="10px"
                              >
                                <Select
                                  id={`speakers.${index + 1}.id`}
                                  placeholder="Select Speaker"
                                  name={`speakers.${index + 1}.id`}
                                  marginRight="1rem"
                                  isCustomField
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      e.currentTarget.name,
                                      e.currentTarget.value
                                    );
                                  }}
                                  data={speakers.map((item) => {
                                    return {
                                      label: item.label,
                                      value: item.value,
                                    };
                                  })}
                                />
                                <RemoveButton
                                  onClick={() => remove(index + 1)}
                                />
                              </Flex>
                            ))}
                        </Flex>
                      </PanelAction>
                    )}
                  </FieldArray>
                  <Panel label="TAGS">
                    <TagInputAutocomplete
                      settingId={settingId}
                      inputName="tagsInput"
                      values={values.tags}
                      options={settingList}
                      setValue={(options: Option[]) => {
                        setFieldValue("tags", options);
                      }}
                      placeholder="Search tags"
                      createText="Create a new tag"
                      renderCheckIcon={<MdCheckCircle color="green.500" />}
                      renderCreateIcon={<MdAdd color="green.500" />}
                    />
                  </Panel>
                  <FieldArray name="resources">
                    {({ remove, push }) => (
                      <PanelAction
                        label="SESSION RESOURCE(S)"
                        action={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              push({
                                url: "",
                              });
                            }}
                          >
                            +
                          </button>
                        }
                      >
                        <Flex flexDirection="column" width="100%">
                          <div key={s.generate()}>
                            <Flex key={0} flexDirection="row" padding="10px">
                              <FileInput
                                name={`resources.0.url`}
                                showRemoveButton={false}
                              />
                            </Flex>
                            {values.resources.length > 0 &&
                              values.resources.map((_, index) => (
                                <Flex
                                  key={index + 1}
                                  flexDirection="row"
                                  padding="10px"
                                >
                                  <FileInput
                                    name={`resources.${index + 1}.url`}
                                    showRemoveButton={false}
                                  />
                                  <RemoveButton
                                    onClick={() => remove(index + 1)}
                                  />
                                </Flex>
                              ))}
                          </div>
                        </Flex>
                      </PanelAction>
                    )}
                  </FieldArray>
                </VStack>
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Panel label="SESSION START">
                    <DatePicker name="startDate" label="DATE" />
                    <TimePicker name="startTime" label="TIME" />
                    <Select
                      name="timezoneNameStart"
                      label=""
                      id="timezoneNameStart"
                      placeholder="Select timezone"
                      isCustomField
                      onChange={(value: any) => {
                        const selectedIndex: number =
                          value.currentTarget.selectedIndex;
                        timezone.map((itemIndex, index) => {
                          if (index === selectedIndex - 1) {
                            setFieldValue("timezoneStart", itemIndex.offset);
                          }
                        });
                      }}
                      data={timezone.map((item) => {
                        return {
                          label: item.value,
                          value: item.abbr,
                        };
                      })}
                    />
                  </Panel>
                  <Panel label="SESSION END">
                    <DatePicker name="endDate" label="DATE" />
                    <TimePicker name="endTime" label="TIME" />
                    <Select
                      name="timezoneNameEnd"
                      label=""
                      id="timezoneNameEnd"
                      placeholder="Select timezone"
                      isCustomField
                      onChange={(value: any) => {
                        const selectedIndex: number =
                          value.currentTarget.selectedIndex;
                        timezone.map((itemIndex, index) => {
                          if (index === selectedIndex - 1) {
                            setFieldValue("timezoneEnd", itemIndex.offset);
                          }
                        });
                      }}
                      data={timezone.map((item) => {
                        return {
                          label: item.value,
                          value: item.abbr,
                        };
                      })}
                    />
                  </Panel>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "25%"]}>
              <MediaUpload
                name="thumbnailUrl"
                type="image"
                accept="image"
                label="SESSION THUMBNAIL"
              />
              <Panel label="STREAM DETAILS">
                <TextInputSwitch
                  isDisabled={!isLivestreamInputEnabled}
                  name="livestreamUrl"
                  label="LIVESTREAM URL"
                  id="livestreamUrl"
                  placeholder="URL"
                  LeftElement={<IoMdLink style={{ fill: "url(#lgrad)" }} />}
                  action={
                    <ChakraSwitch
                      colorScheme="red"
                      display="flex"
                      alignItems="center"
                      id="livestreamURLSwitch"
                      name="livestreamURLSwitch"
                      isChecked={isLivestreamInputEnabled}
                      onChange={() =>
                        setLivestreamInputEnabled(!isLivestreamInputEnabled)
                      }
                    />
                  }
                />
                <TextInputSwitch
                  isDisabled={!isSlidoInputEnabled}
                  name="slido"
                  label="SLIDO"
                  id="slido"
                  placeholder="URL"
                  LeftElement={<IoMdLink style={{ fill: "url(#lgrad)" }} />}
                  action={
                    <ChakraSwitch
                      colorScheme="red"
                      display="flex"
                      alignItems="center"
                      id="slidoSwitch"
                      name="slidoSwitch"
                      isChecked={isSlidoInputEnabled}
                      onChange={() =>
                        setSlidoInputEnabled(!isSlidoInputEnabled)
                      }
                    />
                  }
                />
                <TextInputSwitch
                  isDisabled={!isGetstreamInputEnabled}
                  name="getStreamId"
                  label="GETSTREAM ID"
                  id="getStreamId"
                  placeholder="URL"
                  LeftElement={<IoMdLink style={{ fill: "url(#lgrad)" }} />}
                  action={
                    <ChakraSwitch
                      colorScheme="red"
                      display="flex"
                      alignItems="center"
                      id="getstreamIDSwitch"
                      name="getstreamIDSwitch"
                      isChecked={isGetstreamInputEnabled}
                      onChange={() =>
                        setGetstreamInputEnabled(!isGetstreamInputEnabled)
                      }
                    />
                  }
                />
              </Panel>
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
      )}
    </Formik>
  );
};

export default AuditoriumForm;
