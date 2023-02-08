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
import {
  useDeleteResourceCenter,
  usePublishResourceCenter,
  useResourceCenter,
} from "@/hooks/resource-center";
import { useAppDispatch } from "@/hooks";

const COLUMN_HEADERS = [
  { name: "session", label: "TITLE" },
  { name: "location", label: "location" },
  { name: "noResource", label: "No.OF Resource" },
];

interface InitDataRC {
  id: string;
  session: string;
  location: string;
  noResource: number;
  isActive: boolean;
}

interface initRCInput {
  page: number;
  limit: number;
  search: string;
}

interface RCTableProps {
  dateProps: string;
}

const ResourceCenterTable: FC<RCTableProps> = ({ dateProps }) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [dataRC, setDataRC] = useState<InitDataRC[]>([]);
  const [RCInput, setRCInput] = useState<initRCInput>({
    page: 1,
    limit: 10,
    search: "",
  });

  const {
    fetchResourceCenter,
    loading: isLoadingResourceCenter,
    data: DataResourceCenter,
  } = useResourceCenter({
    listResourceCenterInput: {
      page: RCInput.page,
      limit: RCInput.limit,
      search: RCInput.search,
      startDate: dateProps,
    },
  });

  useEffect(() => {
    fetchResourceCenter();
  }, [fetchResourceCenter]);

  useEffect(() => {
    if (DataResourceCenter) {
      const data = DataResourceCenter?.listResourceCenter.resourceCenter.map(
        (val) => {
          return {
            id: val.id,
            session: val.session ? val.session.title : "",
            location: val.session
              ? val.session.location
                ? val.session.location.name
                : ""
              : "",
            noResource: val.totalResource,
            isActive: val.isActive,
          };
        }
      );
      setDataRC(data);
    }
  }, [DataResourceCenter]);

  //==== DELETE RC =======
  const {
    fetchDeleteResourceCenter,
    loading: isLoadingDeleteResourceCenter,
    data: dataDeleteResourceCenter,
  } = useDeleteResourceCenter();

  useEffect(() => {
    fetchResourceCenter();
  }, [dataDeleteResourceCenter, fetchResourceCenter]);

  //==== PUBLISH RC =======
  const {
    fetchPublishResourceCenter,
    loading: isLoadingPublishResourceCenter,
    data: dataPublishResourceCenter,
  } = usePublishResourceCenter();

  useEffect(() => {
    fetchResourceCenter();
  }, [dataPublishResourceCenter, fetchResourceCenter]);

  const dispatch = useAppDispatch();

  return (
    <Panel label="SESSION LIST">
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput
          onChange={(e) =>
            setRCInput({
              page: RCInput.page,
              limit: RCInput.limit,
              search: e.target.value,
            })
          }
        />
        <div>
          <Link href={"/resource-center/details"} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              Add
            </Button>
          </Link>
        </div>
      </Flex>
      <Panel label="">
        <Table<InitDataRC>
          loading={isLoadingResourceCenter}
          columnHeaders={COLUMN_HEADERS}
          data={dataRC}
          onTitleClick={(id: string, name: string) => {
            return (
              <div>
                <Link
                  href={{
                    pathname: "/resource-center/details",
                    query: { id: id },
                  }}
                >
                  {name}
                </Link>
              </div>
            );
          }}
          actionButtons={(id: string, rowData: InitDataRC) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                id={id}
                isChecked={rowData.isActive}
                onChange={(e) =>
                  fetchPublishResourceCenter({
                    variables: {
                      publishResourceCenterInput: {
                        id: rowData.id,
                        isActive: !rowData.isActive,
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
            setRCInput({
              page: RCInput.page - 1,
              limit: RCInput.limit,
              search: RCInput.search,
            })
          }
          onNextClick={() =>
            setRCInput({
              page: RCInput.page + 1,
              limit: RCInput.limit,
              search: RCInput.search,
            })
          }
          total={
            DataResourceCenter
              ? DataResourceCenter.listResourceCenter.totalPage
              : 0
          }
          currentPage={
            DataResourceCenter
              ? DataResourceCenter.listResourceCenter.page + 1
              : 0
          }
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
          return fetchDeleteResourceCenter({
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

export default ResourceCenterTable;
