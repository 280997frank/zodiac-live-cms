import React, { FC, useState } from "react";

import AuditoriumTable from "@/components/Organisms/AuditoriumTable";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";

import Layout from "@/components/Templates/Layout";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { RiCalendarEventFill } from "react-icons/ri";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

const Auditorium: FC = () => {
  const [date, setDate] = useState<string>(
    dayjs(new Date()).format("YYYY-MM-DD")
  );

  const changeDate = (value: Date) => {
    const dateData = dayjs(value).format("YYYY-MM-DD");
    setDate(dateData);
  };

  console.log({ date });
  return (
    <Layout title="Auditorium | ZodiacLive">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Flex width="100%" justifyContent="space-between">
          <Breadcrumb
            separator={
              <Box marginBottom="8" fontSize="md">
                <BsChevronRight />
              </Box>
            }
          >
            <BreadcrumbItem>
              <Heading as="h1" size="xl" marginBottom="8">
                Auditorium
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
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
        <AuditoriumTable filterDate={date} />
      </VStack>
    </Layout>
  );
};

export default withAuth(Auditorium);
