import React, { FC, useEffect, useState } from "react";
import SearchInput from "@/components/Atoms/SearchInput";
import Link from "next/link";
import { BG_GRADIENT } from "@/constants/ui";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import {
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import Pagination from "@/components/Atoms/Pagination";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import { RequestListVod } from "@/types/vod";
import { useListVod, useRemoveVod, useToggleStatusVod } from "@/hooks/vod";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "location", label: "location" },
  { name: "date", label: "date" },
];

interface InitDataVOD {
  id: string;
  title: string;
  location: string;
  date: string;
  active: boolean;
}

const VodTable: FC = ({}) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [initialListVod, setInitialListVod] = useState<RequestListVod>({
    page: 1,
    limit: 10,
    search: {
      keyword: "",
    },
  });
  const [listVod, setListVod] = useState<InitDataVOD[]>([]);

  //  ==== Get List Vod ====
  const {
    fetchListVod,
    loading: isLoadingListVod,
    data: datalistVod,
  } = useListVod({
    listVodInput: {
      page: initialListVod.page,
      limit: initialListVod.limit,
      search: {
        keyword: initialListVod.search.keyword,
      },
    },
  });

  useEffect(() => {
    fetchListVod();
  }, [fetchListVod, initialListVod]);

  useEffect(() => {
    if (datalistVod) {
      const data = datalistVod?.listVod.vods.map((val) => {
        return {
          id: val.id,
          title: val.title,
          location: val.session ? val.session.location.title : "",
          date: dayjs(val.sessionDate).format("DD-MM-YY"),
          active: val.active,
        };
      });
      setListVod(data);
    }
  }, [datalistVod]);

  //==== TOGGLE STATUS VOD =======
  const {
    fetchToggleStatusVod,
    loading: isLoadingToggleStatusVod,
    data: dataToggleStatusVod,
  } = useToggleStatusVod();

  useEffect(() => {
    fetchListVod();
  }, [dataToggleStatusVod, fetchListVod]);

  //==== REMOVE VOD ====
  const {
    fetchRemoveVod,
    loading: isLoadingRemoveVod,
    data: dataRemoveVod,
  } = useRemoveVod();

  useEffect(() => {
    fetchListVod();
  }, [dataRemoveVod, fetchListVod]);

  return (
    <Panel label="VIDEO ON DEMAND LIST">
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput
          onChange={(e) =>
            setInitialListVod({
              page: initialListVod.page,
              limit: initialListVod.limit,
              search: {
                keyword: e.currentTarget.value,
              },
            })
          }
        />
        <Link href={"/vod/details"} passHref>
          <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
            Add
          </Button>
        </Link>
      </Flex>
      <Panel label="">
        <Table<InitDataVOD>
          loading={false}
          columnHeaders={COLUMN_HEADERS}
          data={listVod}
          onTitleClick={(id: string, name: string) => (
            <Link
              href={{
                pathname: "/vod/details",
                query: { id: id },
              }}
            >
              {name}
            </Link>
          )}
          actionButtons={(id: string, rowData: InitDataVOD) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                id={id}
                isChecked={rowData.active}
                onChange={(e) =>
                  fetchToggleStatusVod({
                    variables: {
                      toggleStatusVodInput: {
                        id: rowData.id,
                        status: !rowData.active,
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
            setInitialListVod({
              page: initialListVod.page - 1,
              limit: initialListVod.limit,
              search: {
                keyword: initialListVod.search.keyword,
              },
            })
          }
          onNextClick={() =>
            setInitialListVod({
              page: initialListVod.page + 1,
              limit: initialListVod.limit,
              search: {
                keyword: initialListVod.search.keyword,
              },
            })
          }
          total={datalistVod ? datalistVod.listVod.page : 0}
          onChange={(e) => console.log("aaa", e.currentTarget.value)}
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
        onConfirmAction={() => {
          return fetchRemoveVod({
            variables: {
              removeVodInput: {
                id: isOpenDeleteDialog.id,
              },
            },
          });
        }}
        header="Delete Video On Demand"
        body="Are you sure?"
        type="delete"
      />
    </Panel>
  );
};

export default VodTable;
