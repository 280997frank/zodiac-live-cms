import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import Link from "next/link";
import {
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { TSponsorsTable } from "@/types/sponsors";
import {
  useSponsorList,
  useSponsorRemove,
  useSponsorToggleStatus,
} from "@/hooks/sponsors";
import { dataPerPage } from "@/constants/sponsors";

const COLUMN_HEADERS = [{ name: "name", label: "TITLE" }];

const SponsorsTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState<TSponsorsTable[]>([]);

  const { fetchMore, response, loading } = useSponsorList({
    page: page,
    limit: dataPerPage,
    search: search,
  });

  const { sponsorRemove, response: responseRemove } = useSponsorRemove();
  const { sponsorToggleStatus } = useSponsorToggleStatus();

  // get sponsor
  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  // get sponsor
  useEffect(() => {
    if (response !== undefined) {
      setData(response.listSponsors.sponsors);
      setTotalPage(response.listSponsors.totalPage);
      setPage(response.listSponsors.page);
    }
  }, [data, totalPage, page, response]);

  // delete sponsor
  useEffect(() => {
    if (responseRemove !== undefined && responseRemove !== null) {
      if (responseRemove.removeSponsor.status) fetchMore();
    }
  }, [responseRemove, fetchMore]);

  return (
    <Panel label="SPONSOR LIST">
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput onChange={(e) => setSearch(e.currentTarget.value)} />
        <Link href={`/sponsors/new`} passHref>
          <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
            Add
          </Button>
        </Link>
      </Flex>
      <Panel label="">
        <Table<TSponsorsTable>
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/sponsors/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, rowData: TSponsorsTable) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                id={id}
                onChange={async (e) => {
                  await sponsorToggleStatus({
                    variables: {
                      id: id,
                      status: !rowData.active,
                    },
                  });
                }}
                colorScheme="red"
                display="flex"
                alignItems="center"
                isChecked={rowData.active}
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
          onPrevClick={() => (page <= 1 ? setPage(1) : setPage(page - 1))}
          onNextClick={() =>
            page < totalPage ? setPage(page + 1) : setPage(totalPage)
          }
          total={totalPage}
          currentPage={page}
          onChange={(e) => {
            if (e.currentTarget.value === "") return;
            setPage(parseInt(e.currentTarget.value));
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
          await sponsorRemove({
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

export default SponsorsTable;
