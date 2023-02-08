import React, { FC } from "react";
import {
  Button,
  IconButton,
  Link,
  Stack,
  Spinner,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { IoMdTrash as DeleteIcon } from "react-icons/io";

import ConfirmDialog from "components/Atoms/ConfirmDialog";
import Pagination from "components/Atoms/Pagination";
import SearchInput from "components/Atoms/SearchInput";
import Switch from "components/Atoms/Switch/SwitchGradient";
import Panel from "components/Molecules/Panel";
import Table from "components/Molecules/Table/Table";
import DatePicker from "components/Atoms/DatePicker/NonField";
import { BG_GRADIENT } from "constants/ui";
import { useErrorMessage } from "hooks";
import useRoundTable, { RoundTableCapacityList } from "hooks/useRoundTable";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "hostName", label: "HOST" },
  { name: "startDate", label: "START" },
  { name: "isPasswordActive", label: "PASSWORD" },
  { name: "capacity", label: "CAPACITY" },
];

const RoundtableTable: FC = () => {
  const {
    error,
    list: roundTableData,
    startDate,
    isFetching,
    togglePassword,
    updateCapacity,
    deleteRoundTable,
    searchRoundTable,
    filterByStartDate,
    toggleActiveStatus,
    isUpdatingPasswordActive,
    isUpdatingCapacity,
    isUpdatingActiveStatus,
    isDeleting,
    isSearching,
    mutationId,
    setMutationId,
    page,
    setPage,
    totalPage,
    prevPage,
    nextPage,
    changePageNumber,
  } = useRoundTable();

  const {
    isOpen: isConfirmDelete,
    onOpen: onConfirmDeletion,
    onClose: onCancelConfirm,
  } = useDisclosure();

  const confirmDeletion = (id: string) => {
    setMutationId(id);
    onConfirmDeletion();
  };

  useErrorMessage(error);

  return (
    <>
      <DatePicker
        value={startDate}
        onChange={filterByStartDate}
        position="absolute"
        top="40px"
        right="10px"
      />
      <Panel label="ROUNDTABLE LIST">
        <Stack direction="row" justify="space-evenly" width="100%">
          <SearchInput
            onChange={(event) => searchRoundTable(event.target.value)}
            isDisabled={isSearching}
          />
          <NextLink href="/roundtable/new" passHref>
            <Button
              as={Link}
              mr={2}
              bgGradient={BG_GRADIENT}
              color="white"
              _hover={{ bgGradient: BG_GRADIENT, opacity: 0.8 }}
            >
              Add
            </Button>
          </NextLink>
        </Stack>

        <Panel label="">
          <Table
            loading={isFetching}
            data={roundTableData}
            columnHeaders={COLUMN_HEADERS}
            columnsRender={{
              isPasswordActive({ id, isPasswordActive }) {
                const isLoading = isUpdatingPasswordActive && mutationId === id;
                return (
                  <Stack
                    direction="row"
                    display="inline-flex"
                    position="relative"
                    align="center"
                  >
                    <Switch
                      opacity={isLoading ? 0.5 : 1}
                      isChecked={isPasswordActive}
                      onChange={() => togglePassword(id)}
                    />
                    {isLoading && (
                      <Spinner
                        size="sm"
                        position="absolute"
                        left="40%"
                        transform="translateX(-40%)"
                      />
                    )}
                  </Stack>
                );
              },
              capacity({ id, capacity }) {
                const isLoading = isUpdatingCapacity && mutationId === id;
                return (
                  <Stack direction="row" position="relative">
                    <Select
                      placeholder="Capacity"
                      opacity={isLoading ? 0.5 : 1}
                      defaultValue={capacity}
                      isDisabled={isLoading}
                      onChange={(event) =>
                        updateCapacity(id, event.target.value)
                      }
                    >
                      {RoundTableCapacityList.map(({ label, value }) => (
                        <option key={`capacity-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                    {isLoading && (
                      <Spinner
                        position="absolute"
                        size="sm"
                        top="25%"
                        left="50%"
                        transform="translate(-50%, -25%)"
                      />
                    )}
                  </Stack>
                );
              },
            }}
            onTitleClick={(id, name) => (
              <Link as={NextLink} href={`/roundtable/${id}`}>
                {name}
              </Link>
            )}
            actionButtons={(id: string, { isActive }) => {
              const isLoading = isUpdatingActiveStatus && mutationId === id;
              return (
                <Stack direction="row" align="center" justify="space-between">
                  <Stack
                    direction="row"
                    display="inline-flex"
                    position="relative"
                    align="center"
                  >
                    <Switch
                      opacity={isLoading ? 0.5 : 1}
                      isChecked={isActive}
                      onChange={() => toggleActiveStatus(id)}
                    />
                    {isLoading && (
                      <Spinner
                        size="sm"
                        position="absolute"
                        left="40%"
                        transform="translateX(-40%)"
                      />
                    )}
                  </Stack>
                  <IconButton
                    aria-label="Remove Data"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    bgColor="white"
                    size="sm"
                    type="button"
                    fontSize="1.4rem"
                    onClick={() => confirmDeletion(id)}
                  />
                </Stack>
              );
            }}
          />
          <Pagination
            currentPage={page}
            onPrevClick={prevPage}
            onNextClick={nextPage}
            total={totalPage}
            onChange={(e) => changePageNumber(Number(e.currentTarget.value))}
          />
        </Panel>

        <ConfirmDialog
          isOpen={isConfirmDelete}
          isLoading={isDeleting}
          onClose={onCancelConfirm}
          onConfirmAction={deleteRoundTable}
          header="Delete a session"
          body="Are you sure? You cant undo this action afterwards."
          type="delete"
        />
      </Panel>
    </>
  );
};

export default RoundtableTable;
