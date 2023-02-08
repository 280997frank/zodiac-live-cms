import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useDeleteBreakoutDetailSession,
  useGetAllSessionsByLocation,
  usePublishBreakoutDetailSession,
} from "@/hooks/breakoutrooms";
import {
  Button,
  Flex,
  IconButton,
  Stack,
  Switch as ChakraSwitch,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "startDate", label: "START" },
  { name: "endDate", label: "END" },
];

interface BreakoutRoomDetailTableProps {
  id: string;
}

interface TSessions {
  isActive: boolean;
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

const LIMIT = 10;

const BreakoutRoomDetailTable: FC<BreakoutRoomDetailTableProps> = ({ id }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const { fetchDeleteBreakoutDetailSession } = useDeleteBreakoutDetailSession(
    id,
    currentPage,
    search,
    LIMIT
  );

  const { fetchPublishBreakoutDetailSession } = usePublishBreakoutDetailSession(
    id,
    currentPage,
    search,
    LIMIT
  );

  const {
    fetchAllSessionsByLocation,
    loading: isFetching,
    data: sessions,
  } = useGetAllSessionsByLocation(id, currentPage, search, LIMIT);

  const totalPage =
    sessions?.getSessionByLocationId !== undefined
      ? sessions.getSessionByLocationId.totalPage
      : 1;

  useEffect(() => {
    fetchAllSessionsByLocation();
  }, [fetchAllSessionsByLocation]);

  return (
    <Stack
      width="100%"
      direction={["column", "row"]}
      align="flex-start"
      spacing="10"
    >
      <VStack spacing="6" w={["100%", "100%"]}>
        <Panel label="">
          <Flex justifyContent="space-evenly" width="100%">
            <SearchInput onChange={(e) => setSearch(e.currentTarget.value)} />
            <Link href={`/breakout-rooms/detail/form/new`} passHref>
              <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
                Add
              </Button>
            </Link>
          </Flex>
          <Panel label="">
            <Table<TSessions>
              loading={isFetching}
              columnHeaders={COLUMN_HEADERS}
              data={
                sessions?.getSessionByLocationId !== undefined
                  ? sessions.getSessionByLocationId.sessions
                  : []
              }
              onTitleClick={(id, name) => (
                <Link
                  href={`/breakout-rooms/detail/form/${encodeURIComponent(id)}`}
                >
                  {name}
                </Link>
              )}
              actionButtons={(id: string, row: TSessions) => (
                <Flex justifyContent="flex-end">
                  <ChakraSwitch
                    id={id}
                    onChange={(e) =>
                      fetchPublishBreakoutDetailSession({
                        variables: {
                          publishSessionInput: {
                            id: e.currentTarget.id,
                            isActive: !row.isActive,
                          },
                        },
                      })
                    }
                    colorScheme="red"
                    display="flex"
                    alignItems="center"
                  />
                  <IconButton
                    aria-label="Remove image"
                    icon={<IoMdTrash />}
                    variant="ghost"
                    bgColor="white"
                    size="sm"
                    type="button"
                    fontSize="1.4rem"
                    onClick={() =>
                      setOpenDeleteDialog({
                        id: id,
                        openDeleteDialog: true,
                      })
                    }
                  />
                </Flex>
              )}
            />
            <Pagination
              onPrevClick={() =>
                currentPage <= 1
                  ? setCurrentPage(1)
                  : setCurrentPage(currentPage - 1)
              }
              onNextClick={() =>
                currentPage < totalPage
                  ? setCurrentPage(currentPage + 1)
                  : setCurrentPage(totalPage)
              }
              total={totalPage}
              currentPage={currentPage}
              onChange={(e) => {
                if (e.currentTarget.value === "") return;
                setCurrentPage(parseInt(e.currentTarget.value));
              }}
            />
          </Panel>
        </Panel>
      </VStack>
      <ConfirmDialog
        isOpen={isOpenDeleteDialog.openDeleteDialog}
        onClose={() =>
          setOpenDeleteDialog({
            id: "",
            openDeleteDialog: false,
          })
        }
        onConfirmAction={async () => {
          await fetchDeleteBreakoutDetailSession({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
        }}
        header="Delete a session"
        body="Are you sure? You cant undo this action afterwards."
        type="delete"
      />
    </Stack>
  );
};

export default BreakoutRoomDetailTable;
