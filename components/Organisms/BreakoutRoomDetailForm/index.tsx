import { Button, ButtonGroup, Stack, VStack } from "@chakra-ui/react";
import React, { FC, useCallback, useState } from "react";
import MediaUpload from "@/components/Atoms/MediaUpload";
import { Form, Formik } from "formik";
import TextInput from "@/components/Atoms/TextInput";
import { BG_GRADIENT } from "@/constants/ui";
import { useEditLocation, useGetLocation } from "@/hooks/breakoutrooms";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Location, LocationInitialValues } from "@/types/breakoutrooms";
import { useUploadFile } from "@/hooks/upload";
import { MediaFolderType } from "@/types/upload";

interface BreakoutRoomDetailFormProps {
  id: string;
  name: string;
  locationMediaUrl: string;
}

const BreakoutRoomDetailForm: FC<BreakoutRoomDetailFormProps> = ({
  id,
  name,
  locationMediaUrl,
}) => {
  const { uploadFile } = useUploadFile();
  const [initialValues, setInitialValues] = useState(LocationInitialValues);
  const { mutationEditLocation } = useEditLocation();

  useEffect(() => {
    setInitialValues({
      name: name,
      locationMediaUrl: locationMediaUrl,
    });
  }, [name, locationMediaUrl]);

  const submitForm = useCallback(
    async (values: { name: string; locationMediaUrl: string | File }) => {
      let mediaUrl = "";
      if (values.locationMediaUrl instanceof File) {
        // NOTE: upload separately and save the URL
        const uploadResult = await uploadFile({
          variables: {
            uploadFilesInput: {
              file: values.locationMediaUrl,
              folder: MediaFolderType.BREAKOUT_ROOM,
            },
          },
        });
        mediaUrl = uploadResult.data?.uploadFile.url || "";
      } else {
        mediaUrl = values.locationMediaUrl;
      }

      mutationEditLocation({
        variables: {
          editLocationInput: {
            id: id,
            locationMediaUrl: mediaUrl,
            name: values.name,
            locationType: "BREAKOUT_ROOM",
          },
        },
      });
    },
    [id, mutationEditLocation, uploadFile]
  );

  return (
    <Stack
      width="100%"
      direction={["column", "row"]}
      align="flex-start"
      spacing="10"
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values) => {
          await submitForm(values);
        }}
      >
        {({ isSubmitting, resetForm }) => (
          <Form style={{ width: "100%" }}>
            <Stack
              direction={["row"]}
              align="flex-start"
              spacing="10"
              width="100%"
            >
              <VStack spacing="6" w={["100%", "65%"]} alignItems="start">
                <TextInput
                  label="BREAKOUT ROOM NAME"
                  id="name"
                  name="name"
                  placeholder="Breakout Room name"
                />
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
                    onClick={() => resetForm()}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </VStack>
              <VStack spacing="6" w={["100%", "35%"]}>
                <MediaUpload
                  name="locationMediaUrl"
                  type="image"
                  accept="image"
                  label="BREAKOUT ROOM IMAGE"
                />
              </VStack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};

export default BreakoutRoomDetailForm;
