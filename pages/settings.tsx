import { Form, Formik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import { RiAddFill } from "react-icons/ri";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/breadcrumb";
import { Heading, VStack } from "@chakra-ui/layout";
import { Button, ButtonGroup, Stack } from "@chakra-ui/react";
import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

import { SettingsInitialValues } from "@/constants/form";
import { BG_GRADIENT } from "@/constants/ui";

import {
  useDeleteTags,
  useSaveTags,
  useSettingPageList,
} from "@/hooks/setting";
import { SettingPageInput } from "@/types/setting";

import withAuth from "@/utils/withAuth";

import Layout from "components/Templates/Layout";

import {
  Option,
  TagInputAutocomplete,
} from "@/components/Atoms/TagInputAutocomplete";
import Panel from "@/components/Molecules/Panel";

const options = [{ id: "", name: "" }];

const Settings: FC = () => {
  const [initialSettingValues, setInitialSettingValues] =
    useState<SettingPageInput>();

  const {
    fetchSettingPageList,
    loading: isFetchingSettingPage,
    data: settingPageData,
  } = useSettingPageList();

  useEffect(() => {
    fetchSettingPageList();
  }, [fetchSettingPageList]);

  useEffect(() => {
    if (!isFetchingSettingPage && settingPageData !== undefined) {
      const interests = settingPageData.listSettings.settings.filter(
        (item) => item.name === "Interests"
      );
      const industry = settingPageData.listSettings.settings.filter(
        (item) => item.name === "Industry"
      );
      const topics = settingPageData.listSettings.settings.filter(
        (item) => item.name === "Topics (For Sessions)"
      );

      const interestsProper = interests[0].tags.map((item) => {
        return { id: item.id, name: item.name };
      });
      const industryProper = industry[0].tags.map((item) => {
        return { id: item.id, name: item.name };
      });
      const topicsProper = topics[0].tags.map((item) => {
        return { id: item.id, name: item.name };
      });

      setInitialSettingValues({
        interests: {
          id: interests[0].id,
          tags: interestsProper,
        },
        industry: {
          id: industry[0].id,
          tags: industryProper,
        },
        topics: {
          id: topics[0].id,
          tags: topicsProper,
        },
      });
    }
  }, [isFetchingSettingPage, settingPageData]);

  const { fetchSaveTags } = useSaveTags();
  const { fetchDeleteTags } = useDeleteTags();

  const submitForm = useCallback(
    async (values: SettingPageInput) => {
      if (initialSettingValues !== undefined) {
        const saveNewTags = {
          interests: {
            id: "",
            tags: [
              {
                id: "",
                name: "",
              },
            ],
          },
          industry: {
            id: "",
            tags: [
              {
                id: "",
                name: "",
              },
            ],
          },
          topics: {
            id: "",
            tags: [
              {
                id: "",
                name: "",
              },
            ],
          },
        };
        const removedTags: { ids: string[] } = {
          ids: [],
        };

        const interests = isEqual(
          sortBy(values.interests.tags, ["name"]),
          sortBy(initialSettingValues.interests.tags, ["name"])
        );
        if (!interests) {
          const formValues = sortBy(values.interests.tags, ["name"]);
          const initialValues = sortBy(initialSettingValues.interests.tags, [
            "name",
          ]);
          const newDiff = differenceWith(formValues, initialValues, isEqual);
          const removedDiff = differenceWith(
            initialValues,
            formValues,
            isEqual
          );
          saveNewTags.interests = {
            id: initialSettingValues.interests.id,
            tags: newDiff,
          };
          removedDiff.map((tag) => {
            removedTags.ids.push(tag.id);
          });
        }

        const industry = isEqual(
          sortBy(values.industry.tags, ["name"]),
          sortBy(initialSettingValues.industry.tags, ["name"])
        );
        if (!industry) {
          const formValues = sortBy(values.industry.tags, ["name"]);
          const initialValues = sortBy(initialSettingValues.industry.tags, [
            "name",
          ]);
          const newDiff = differenceWith(formValues, initialValues, isEqual);
          const removedDiff = differenceWith(
            initialValues,
            formValues,
            isEqual
          );
          saveNewTags.industry = {
            id: initialSettingValues.industry.id,
            tags: newDiff,
          };
          removedDiff.map((tag) => {
            removedTags.ids.push(tag.id);
          });
        }

        const topics = isEqual(
          sortBy(values.topics.tags, ["name"]),
          sortBy(initialSettingValues.topics.tags, ["name"])
        );
        if (!topics) {
          const formValues = sortBy(values.topics.tags, ["name"]);
          const initialValues = sortBy(initialSettingValues.topics.tags, [
            "name",
          ]);
          const newDiff = differenceWith(formValues, initialValues, isEqual);
          const removedDiff = differenceWith(
            initialValues,
            formValues,
            isEqual
          );
          saveNewTags.topics = {
            id: initialSettingValues.topics.id,
            tags: newDiff,
          };
          removedDiff.map((tag) => {
            removedTags.ids.push(tag.id);
          });
        }

        // console.log({ saveNewTags, removedTags });
        await fetchSaveTags({
          variables: {
            settingInput: saveNewTags,
          },
        });

        await fetchDeleteTags({
          variables: {
            deleteInput: removedTags,
          },
        });
      }
    },
    [initialSettingValues, fetchSaveTags, fetchDeleteTags]
  );

  return (
    <Layout title="Settings Form | Zodiac Live">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Settings
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Formik
          initialValues={
            initialSettingValues !== undefined
              ? initialSettingValues
              : SettingsInitialValues
          }
          enableReinitialize
          onSubmit={async (values) => {
            await submitForm(values);
          }}
        >
          {({ values, setFieldValue, resetForm, isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <Stack
                direction={["column", "row"]}
                align="flex-start"
                spacing="10"
              >
                <VStack spacing="6" w={["100%", "33%"]}>
                  <Panel label="INTERESTS">
                    <TagInputAutocomplete
                      values={values.interests.tags}
                      customIcon={<RiAddFill style={{ fill: "url(#lgrad)" }} />}
                      options={options}
                      setValue={(options: Option[]) => {
                        setFieldValue("interests.tags", options);
                      }}
                      placeholder="Add a tag"
                      createText="Create a new tag"
                      renderCheckIcon={<MdCheckCircle color="green.500" />}
                      renderCreateIcon={<MdAdd color="green.500" />}
                    />
                  </Panel>
                </VStack>
                <VStack spacing="6" w={["100%", "33%"]}>
                  <Panel label="INDUSTRY">
                    <TagInputAutocomplete
                      customIcon={<RiAddFill style={{ fill: "url(#lgrad)" }} />}
                      values={values.industry.tags}
                      options={options}
                      setValue={(options: Option[]) => {
                        setFieldValue("industry.tags", options);
                      }}
                      placeholder="Add a tag"
                      createText="Create a new tag"
                      renderCheckIcon={<MdCheckCircle color="green.500" />}
                      renderCreateIcon={<MdAdd color="green.500" />}
                    />
                  </Panel>
                </VStack>
                <VStack spacing="6" w={["100%", "33%"]}>
                  <Panel label="TOPICS (FOR SESSIONS)">
                    <TagInputAutocomplete
                      values={values.topics.tags}
                      options={options}
                      customIcon={<RiAddFill style={{ fill: "url(#lgrad)" }} />}
                      setValue={(options: Option[]) => {
                        setFieldValue("topics.tags", options);
                      }}
                      placeholder="Add a tag"
                      createText="Create a new tag"
                      renderCheckIcon={<MdCheckCircle color="green.500" />}
                      renderCreateIcon={<MdAdd color="green.500" />}
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
      </VStack>
    </Layout>
  );
};

export default withAuth(Settings);
