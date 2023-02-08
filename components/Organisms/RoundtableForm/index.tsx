import React, { FC } from "react";
import {
  Button,
  ButtonGroup,
  Box,
  Stack,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import { Form, FormikProvider, Field, FieldProps } from "formik";
import cx from "classnames";

import DatePicker from "components/Atoms/DatePicker";
import MediaUpload from "components/Atoms/MediaUpload";
import Select from "components/Atoms/Select";
import TextInput from "components/Atoms/TextInput";
import PasswordInput from "components/Atoms/PasswordInput";
import RichTextInput from "components/Atoms/RichTextInput";
import TimePicker from "components/Atoms/TimePicker";
import Panel from "components/Molecules/Panel";
import Switch from "@/components/Atoms/Switch/SwitchGradient";
import { timezone } from "constants/timezone";
import { BG_GRADIENT } from "constants/ui";

import { RoundTableCapacityList } from "hooks/useRoundTable";
import useRoundTableForm, { RoundtableField } from "hooks/useRoundTableForm";
import { useErrorMessage } from "hooks";

// Custom Panel props
const panelProps = {
  p: 2,
  sx: {
    "input, select": {
      py: 1,
      px: 2,
      h: "auto",
      border: 0,
      boxShadow: "none",
      outline: "none",
      _focus: {
        boxShadow: "none",
      },
    },
    "&.password-input": {
      "&:not(.is-active)": {
        border: "none",
        bg: "none",
        svg: {
          opacity: 0.1,
        },
      },
      button: {
        display: "inline-block",
        transform: "translate(calc(100% - 10px), -25%)",
        p: 0,
        w: "auto",
        h: "auto",
      },
    },
  },
};

type RoundtableFormProps = {
  isNewSession?: boolean;
};

const RoundtableForm: FC<RoundtableFormProps> = ({ isNewSession = false }) => {
  const { formik, isFetching, error, onCancel } =
    useRoundTableForm(isNewSession);
  useErrorMessage(error);

  return (
    <Box
      w="100%"
      sx={{ form: { w: "100%" } }}
      pointerEvents={formik.isSubmitting ? "none" : undefined}
      opacity={formik.isSubmitting ? 0.5 : 1}
    >
      <FormikProvider value={formik}>
        <Form>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "75%"]}>
              <Panel label="SESSION TITLE" stackProps={panelProps}>
                {isFetching && <Skeleton w="100%" h="40px" />}
                {!isFetching && (
                  <TextInput
                    id={RoundtableField.Title}
                    name={RoundtableField.Title}
                    placeholder="Session Title"
                  />
                )}
              </Panel>

              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                {/* Left stack layout */}
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Panel label="SESSION DESCRIPTION">
                    {isFetching && (
                      <VStack w="100%" h="100%">
                        <Skeleton w="100%" h="45px" mb="2px" />
                        <Skeleton w="100%" h="155px" />
                      </VStack>
                    )}
                    {!isFetching && (
                      <RichTextInput
                        id={RoundtableField.Description}
                        name={RoundtableField.Description}
                      />
                    )}
                  </Panel>

                  <Panel label="Host" stackProps={panelProps}>
                    {isFetching && <Skeleton w="100%" h="35px" />}
                    {!isFetching && (
                      <TextInput
                        id={RoundtableField.Host}
                        name={RoundtableField.Host}
                        placeholder="Host name"
                      />
                    )}
                  </Panel>

                  <Panel label="Capacity" stackProps={panelProps}>
                    {isFetching && <Skeleton w="100%" h="35px" />}
                    {!isFetching && (
                      <Select
                        isCustomField
                        id={RoundtableField.Capacity}
                        name={RoundtableField.Capacity}
                        placeholder="Select capacity"
                        data={RoundTableCapacityList}
                      />
                    )}
                  </Panel>

                  <Panel
                    label="Password"
                    stackProps={{
                      className: cx("password-input", {
                        "is-active": formik.values.isPasswordActive,
                      }),
                      ...panelProps,
                    }}
                  >
                    {isFetching && <Skeleton w="100%" h="35px" />}
                    {!isFetching && (
                      <>
                        <PasswordInput
                          id={RoundtableField.Password}
                          name={RoundtableField.Password}
                          isDisabled={!formik.values.isPasswordActive}
                          placeholder="Password"
                        />
                        <Field
                          name={RoundtableField.IsPasswordActive}
                          render={({ field }: FieldProps<boolean>) => (
                            <Switch
                              mt="0!important"
                              position="absolute"
                              top="0"
                              right="0"
                              name={field.name}
                              isChecked={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </>
                    )}
                  </Panel>
                </VStack>

                {/* Right stack layout */}
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Panel label="SESSION START">
                    {isFetching && (
                      <VStack w="100%" h="100%" align="flex-start">
                        <Skeleton w="40px" h="24px" mb="5px" />
                        <Skeleton w="100%" h="40px" />
                        <Skeleton w="40px" h="24px" mb="5px" />
                        <Skeleton w="100%" h="40px" />
                        <Skeleton w="100%" h="40px" />
                      </VStack>
                    )}

                    {!isFetching && (
                      <>
                        <DatePicker
                          name={RoundtableField.StartDate}
                          label="DATE"
                        />
                        <TimePicker
                          name={RoundtableField.StartTime}
                          label="TIME"
                        />
                        <Select
                          isCustomField
                          id={RoundtableField.TimezoneNameStart}
                          name={RoundtableField.TimezoneNameStart}
                          placeholder="Select timezone"
                          data={timezone.map((item) => ({
                            label: item.value,
                            value: item.abbr,
                          }))}
                        />
                      </>
                    )}
                  </Panel>
                  <Panel label="SESSION END">
                    {isFetching && (
                      <VStack w="100%" h="100%" align="flex-start">
                        <Skeleton w="40px" h="24px" mb="5px" />
                        <Skeleton w="100%" h="40px" />
                        <Skeleton w="40px" h="24px" mb="5px" />
                        <Skeleton w="100%" h="40px" />
                        <Skeleton w="100%" h="40px" />
                      </VStack>
                    )}

                    {!isFetching && (
                      <>
                        <DatePicker
                          name={RoundtableField.EndDate}
                          label="DATE"
                        />
                        <TimePicker
                          name={RoundtableField.EndTime}
                          label="TIME"
                        />
                        <Select
                          isCustomField
                          id={RoundtableField.TimezoneNameEnd}
                          name={RoundtableField.TimezoneNameEnd}
                          placeholder="Select timezone"
                          data={timezone.map((item) => ({
                            label: item.value,
                            value: item.abbr,
                          }))}
                        />
                      </>
                    )}
                  </Panel>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "25%"]}>
              {isFetching && (
                <VStack align="flex-start" w="100%">
                  <Skeleton width="120px" height="22px" mb={1} />
                  <Skeleton width="100%" height="150px" />
                </VStack>
              )}
              {!isFetching && (
                <MediaUpload
                  name={RoundtableField.ThumbnailUrl}
                  type="image"
                  accept="image"
                  label="SESSION THUMBNAIL"
                />
              )}
            </VStack>
          </Stack>

          <ButtonGroup mt="8">
            <Button
              bgGradient={BG_GRADIENT}
              color="white"
              type="submit"
              isLoading={formik.isSubmitting}
              loadingText={isNewSession ? "Adding" : "Saving"}
              _hover={{ bgGradient: BG_GRADIENT, opacity: 0.8 }}
            >
              {isNewSession ? "Add New" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              color="gray.500"
              bg="white"
              isDisabled={formik.isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default RoundtableForm;
