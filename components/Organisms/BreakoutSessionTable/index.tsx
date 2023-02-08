import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useDeleteBreakoutSession,
  useGetAllSessions,
  useGetLocationList,
  usePublishBreakoutSession,
  useSetLocation,
} from "@/hooks/breakoutrooms";
import {
  Button,
  Flex,
  IconButton,
  Select,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "speakers", label: "SPEAKER(S)" },
  { name: "startTime", label: "START" },
  { name: "locationId", label: "LOCATION" },
];

interface TSessions {
  isActive: boolean;
  id: string;
  title: string;
  speakers: {
    fullname: string | null;
  }[];
  location: {
    id: string;
    name: string;
  };
  startDate: string;
  locationId: string;
  locationName: string;
}

const LIMIT = 10;

const BreakoutSessionTable: FC = () => {
  const [data, setData] = useState<TSessions[]>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const {
    fetchAllSessions,
    loading: isFetchingAllSessions,
    data: allSessions,
  } = useGetAllSessions(currentPage, search, LIMIT);

  const totalPage =
    allSessions !== undefined ? allSessions.listSession.totalPage : 1;

  useEffect(() => {
    fetchAllSessions();
  }, [fetchAllSessions]);

  const { fetchLocationList, data: locationListData } = useGetLocationList(
    1,
    "",
    99
  );

  useEffect(() => {
    fetchLocationList();
  }, [fetchLocationList]);

  useEffect(() => {
    if (allSessions !== undefined) {
      const newData: TSessions[] = [];
      allSessions.listSession.sessions.map((data) => {
        if (data.location === null) {
          newData.push({
            ...data,
            locationId: "",
            locationName: "",
          });
        } else {
          newData.push({
            ...data,
            locationId: data.location.id,
            locationName: data.location.name,
          });
        }
      });
      setData(newData);
    }
  }, [allSessions]);

  const { fetchDeleteBreakoutSession } = useDeleteBreakoutSession(
    currentPage,
    search,
    LIMIT
  );
  const { fetchPublishBreakoutSession } = usePublishBreakoutSession(
    currentPage,
    search,
    LIMIT
  );
  const { mutationSetLocation } = useSetLocation(currentPage, search, LIMIT);

  return (
    <Panel label="">
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput onChange={(e) => setSearch(e.currentTarget.value)} />
        <Link href={`/breakout-rooms/new`} passHref>
          <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
            Add
          </Button>
        </Link>
      </Flex>
      <Panel label="">
        <Table<TSessions>
          loading={isFetchingAllSessions}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data : []}
          onTitleClick={(id, name) => (
            <Link href={`/breakout-rooms/${encodeURIComponent(id)}`}>
              {name}
            </Link>
          )}
          DropdownStatus={(id, label, name) => {
            return (
              <Select
                value={name}
                onChange={(e) => {
                  // console.log(`sessionID ${id}`, `locationID ${name}`)
                  mutationSetLocation({
                    variables: {
                      setLocationInput: {
                        sessionId: id,
                        locationId: e.currentTarget.value,
                      },
                    },
                  });
                }}
                width="max-content"
              >
                <option value="" disabled selected>
                  Select an option
                </option>
                {locationListData !== undefined
                  ? locationListData.listLocation.locations.map(
                      (data, index) => {
                        return (
                          <option key={index} value={data.id}>
                            {data.name}
                          </option>
                        );
                      }
                    )
                  : []}
              </Select>
            );
          }}
          actionButtons={(id: string, row: TSessions) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                id={id}
                isChecked={row.isActive}
                onChange={(e) =>
                  fetchPublishBreakoutSession({
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
          await fetchDeleteBreakoutSession({
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

export default BreakoutSessionTable;
