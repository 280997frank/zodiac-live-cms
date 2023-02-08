import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useAuditoriumPageList,
  useDeleteSession,
  usePublishSession,
} from "@/hooks/auditorium";
import {
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "speakers", label: "SPEAKER(S)" },
  { name: "startDate", label: "START" },
  { name: "endDate", label: "END" },
];

interface TAuditorium {
  id: string;
  title: string;
  speakers: {
    fullname: string;
  }[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AuditoriumTableProps {
  filterDate: string;
}

const LIMIT = 10;

const AuditoriumTable: FC<AuditoriumTableProps> = ({ filterDate }) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    fetchAuditoriumPageList,
    loading: isFetchingAuditoriumPage,
    data: auditoriumPageData,
  } = useAuditoriumPageList(currentPage, search, LIMIT, filterDate);

  const { fetchDeleteSession } = useDeleteSession(
    currentPage,
    search,
    LIMIT,
    filterDate
  );
  const { fetchPublishSession } = usePublishSession(
    currentPage,
    search,
    LIMIT,
    filterDate
  );

  useEffect(() => {
    fetchAuditoriumPageList();
  }, [fetchAuditoriumPageList]);

  const totalPage =
    auditoriumPageData !== undefined
      ? auditoriumPageData.listSession.totalPage
      : 1;

  return (
    <Panel label="SESSION LIST">
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput onChange={(e) => setSearch(e.currentTarget.value)} />
        <Link href={`/auditorium/new`} passHref>
          <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
            Add
          </Button>
        </Link>
      </Flex>
      <Panel label="">
        <Table
          loading={isFetchingAuditoriumPage}
          columnHeaders={COLUMN_HEADERS}
          data={
            auditoriumPageData !== undefined
              ? auditoriumPageData.listSession.sessions
              : []
          }
          onTitleClick={(id: string, name: string) => (
            <Link href={`/auditorium/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, row: TAuditorium) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                id={id}
                isChecked={row.isActive}
                onChange={(e) =>
                  fetchPublishSession({
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
      <ConfirmDialog
        isOpen={isOpenDeleteDialog.openDeleteDialog}
        onClose={() =>
          setOpenDeleteDialog({
            id: "",
            openDeleteDialog: false,
          })
        }
        onConfirmAction={async () => {
          await fetchDeleteSession({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
        }}
        header="Delete a session"
        body="Are you sure? You cant undo this action afterwards."
        type="delete"
      />
    </Panel>
  );
};

export default AuditoriumTable;
