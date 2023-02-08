import React, { FC, ReactElement, useState } from "react";
import Layout from "@/components/Templates/Layout";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react"; /**/
import { BsChevronRight } from "react-icons/bs";
import ResourceCenterTable from "@/components/Organisms/ResourceCenterTable";
import { RiCalendarEventFill } from "react-icons/ri";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { Flex } from "@chakra-ui/layout";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import ResourceCenterGeneralForm from "@/components/Organisms/ResourceCenterGeneralForm";

dayjs.extend(customParseFormat);

const ResourceCenter: FC = (): ReactElement => {
  const [date, setDate] = useState<string>(
    dayjs(new Date()).format("YYYY-MM-DD")
  );

  const changeDate = (value: Date) => {
    const dateData = dayjs(value).format("YYYY-MM-DD");
    setDate(dateData);
  };
  return (
    <Layout title="Auditorium | ZodiacLive">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          width="100%"
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <Flex flexDirection="row" justify="space-between">
            <Box p="4">
              <BreadcrumbItem>
                <Heading as="h1" size="xl" marginBottom="8">
                  Resource Center
                </Heading>
              </BreadcrumbItem>
            </Box>
            <Spacer />
            <Box p="4">
              <DayPickerInput
                format="DD-MM-YYYY"
                value={date}
                component={(props: Record<string, unknown>) => {
                  return (
                    <InputGroup>
                      <InputLeftElement color="gray.300" fontSize="1.2em">
                        <RiCalendarEventFill style={{ fill: "url(#lgrad)" }} />
                      </InputLeftElement>
                      <Input {...props} />
                    </InputGroup>
                  );
                }}
                onDayChange={changeDate}
              />
            </Box>
          </Flex>
        </Breadcrumb>
        <Tabs width="100%" colorScheme="black">
          <TabList borderBottom="0">
            <Tab style={{ fontWeight: "bold" }}>SESSION RESOURCE</Tab>
            <Tab style={{ fontWeight: "bold" }}>GENERAL RESOURCE</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ResourceCenterTable dateProps={date} />
            </TabPanel>
            <TabPanel>
              <ResourceCenterGeneralForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Layout>
  );
};
export default ResourceCenter;
