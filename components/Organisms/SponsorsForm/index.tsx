import React, { FC, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Stack, VStack } from "@chakra-ui/layout";

import { Button, ButtonGroup } from "@chakra-ui/button";
import { FiLink2 } from "react-icons/fi";
import { useRouter } from "next/router";

import TextInput from "@/components/Atoms/TextInput";
import MediaUpload from "@/components/Atoms/MediaUpload";

import {
  sponsorsInitialValues,
  sponsorsValidationSchema,
} from "@/constants/sponsors";

import { BG_GRADIENT } from "@/constants/ui";

import {
  useSponsorAddSubmit,
  useSponsorDetail,
  useSponsorEditSubmit,
} from "@/hooks/sponsors";

import { useUploadFile } from "@/hooks/upload";

import { TSponsorsInitialValue } from "@/types/sponsors";
import { MediaFolderType } from "@/types/upload";

const SponsorsForm: FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const id = slug as string;
  const { getSponsor, response } = useSponsorDetail(id);
  const { sponsorEditSubmit, loading: loadingEdit } = useSponsorEditSubmit();
  const {
    sponsorAddSubmit,
    response: responseAdd,
    loading: loadingAdd,
  } = useSponsorAddSubmit();
  const { uploadFile } = useUploadFile();

  // get sponsor
  useEffect(() => {
    if (id && id !== "new") {
      getSponsor();
    }
  }, [getSponsor, id]);

  // set loading status
  useEffect(() => {
    if (id !== "new") {
      setSubmitting(loadingEdit);
    } else {
      setSubmitting(loadingAdd);
    }
  }, [isSubmitting, loadingEdit, loadingAdd, id]);

  // redirect after success add sponsor
  useEffect(() => {
    if (responseAdd !== undefined) router.push("/sponsors");
  }, [responseAdd, router]);

  return (
    <Formik
      enableReinitialize
      initialValues={
        id === "new"
          ? (sponsorsInitialValues as TSponsorsInitialValue)
          : (response?.getSponsorById as TSponsorsInitialValue)
      }
      validationSchema={sponsorsValidationSchema}
      onSubmit={async (values) => {
        let lobbyMediaUrl = "";

        // Upload image if type value of logo is file
        if (values.logo instanceof File) {
          // NOTE: upload separately and save the URL
          const uploadResult = await uploadFile({
            variables: {
              uploadFilesInput: {
                file: values.logo,
                folder: MediaFolderType.SPONSOR,
              },
            },
          });

          lobbyMediaUrl = uploadResult.data?.uploadFile.url || "";
        } else {
          lobbyMediaUrl = values.logo;
        }

        // Submit data
        if (id !== "new") {
          await sponsorEditSubmit({
            variables: {
              id: id,
              name: values.name,
              url: values.url,
              logo: lobbyMediaUrl,
            },
          });
        } else {
          await sponsorAddSubmit({
            variables: {
              name: values.name,
              url: values.url,
              logo: lobbyMediaUrl,
            },
          });
        }
      }}
    >
      {({ resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "60%"]}>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <TextInput
                    name="name"
                    label="SPONSOR NAME"
                    id="name"
                    placeholder="Sponsor Title"
                  />
                  <TextInput
                    name="url"
                    label="SPONSOR URL"
                    id="url"
                    placeholder="Sponsor URL"
                    LeftElement={<FiLink2 stroke="url(#gradient)" />}
                  />
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "40%"]}>
              <MediaUpload
                name="logo"
                type="image"
                accept="image"
                label="SPONSOR LOGO"
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
              disabled={isSubmitting}
              onClick={() => resetForm()}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export default SponsorsForm;
