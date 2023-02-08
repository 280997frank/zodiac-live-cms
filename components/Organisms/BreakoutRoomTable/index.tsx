import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import MediaUploadSubmitOnChange from "@/components/Atoms/MediaUploadSubmitOnChange";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useAddLocation,
  useDeleteLocation,
  useGetBreakoutHallGallery,
  useGetLocationList,
  usePublishLocation,
  useUploadBreakoutHall,
} from "@/hooks/breakoutrooms";
import { MediaFolderType } from "@/types/upload";
import {
  Button,
  Flex,
  IconButton,
  Stack,
  Switch as ChakraSwitch,
  VStack,
} from "@chakra-ui/react";
import { Formik } from "formik";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";

const COLUMN_HEADERS = [
  { name: "name", label: "ROOM NAME" },
  { name: "sessionLocation", label: "NO. OF SESSIONS" },
];

interface TBreakoutRoom {
  id: string;
  name: string;
  locationType: string;
  sessionLocation: {
    total: number;
  };
  locationMediaUrl: string;
  isActive: boolean;
}

const LIMIT = 10;

const BreakoutRoomTable: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [URL, setURL] = useState("");
  const [imageId, setImageId] = useState("");

  const { mutationUploadBreakoutHall } = useUploadBreakoutHall();
  const { fetchBreakoutHallGallery, data: getBreakoutHallGallery } =
    useGetBreakoutHallGallery();

  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const {
    fetchLocationList,
    loading: isFetchingLocationList,
    data: locationListData,
  } = useGetLocationList(currentPage, search, LIMIT);

  const totalPage =
    locationListData !== undefined
      ? locationListData.listLocation.totalPage
      : 1;

  const { mutationAddLocation } = useAddLocation(currentPage, search, LIMIT);
  const { mutationPublishLocation } = usePublishLocation(
    currentPage,
    search,
    LIMIT
  );
  const { mutationDeleteLocation } = useDeleteLocation(
    currentPage,
    search,
    LIMIT
  );

  useEffect(() => {
    fetchLocationList();
    fetchBreakoutHallGallery({
      variables: {
        getGalleryInput: {
          folder: "BREAKOUT_HALL",
        },
      },
    });
  }, [fetchLocationList, fetchBreakoutHallGallery]);

  useEffect(() => {
    if (
      getBreakoutHallGallery !== undefined &&
      getBreakoutHallGallery !== null &&
      getBreakoutHallGallery.getGalleries[0] !== undefined
    ) {
      setURL(getBreakoutHallGallery.getGalleries[0].url);
      setImageId(getBreakoutHallGallery.getGalleries[0].id);
    }
  }, [getBreakoutHallGallery]);

  return (
    <Stack direction={["column", "row"]} align="flex-start" spacing="10">
      <VStack spacing="6" w={["100%", "75%"]}>
        <Panel label="">
          <Flex justifyContent="space-evenly" width="100%">
            <SearchInput onChange={(e) => setSearch(e.currentTarget.value)} />
            <Button
              marginLeft="1rem"
              bgImage={BG_GRADIENT}
              color="white"
              onClick={() =>
                mutationAddLocation({
                  variables: {
                    addLocationInput: {
                      name: `Breakout Room ${
                        locationListData !== undefined
                          ? locationListData.listLocation.locations.length + 1
                          : 1
                      }`,
                      locationType: "BREAKOUT_ROOM",
                    },
                  },
                })
              }
            >
              Add
            </Button>
          </Flex>
          <Panel label="">
            <Table<TBreakoutRoom>
              loading={isFetchingLocationList}
              columnHeaders={COLUMN_HEADERS}
              data={
                locationListData !== undefined
                  ? locationListData.listLocation.locations
                  : []
              }
              onTitleClick={(id: string, name: string) => (
                <Link href={`/breakout-rooms/detail/${encodeURIComponent(id)}`}>
                  {name}
                </Link>
              )}
              actionButtons={(id: string, rowData: TBreakoutRoom) => (
                <Flex justifyContent="flex-end">
                  <ChakraSwitch
                    id={id}
                    isChecked={rowData.isActive}
                    onChange={() =>
                      mutationPublishLocation({
                        variables: {
                          publishLocationInput: {
                            id: id,
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
      <VStack spacing="6" w={["100%", "25%"]}>
        <Formik
          enableReinitialize
          initialValues={{
            url: URL,
          }}
          onSubmit={(values) => {
            console.log({ values });
          }}
        >
          {({ submitForm, setFieldValue, values }) => (
            <MediaUploadSubmitOnChange
              name="url"
              type="image"
              label="BREAKOUT ROOM HALL IMAGE"
              onSubmit={async (e) => {
                let mediaUrl = "";
                if (e.currentTarget.files[0] instanceof File) {
                  const uploadResult = await mutationUploadBreakoutHall({
                    variables: {
                      param: [
                        {
                          file: e.currentTarget.files[0],
                          folder: MediaFolderType.BREAKOUT_HALL,
                          imageId: imageId,
                        },
                      ],
                    },
                  });
                  mediaUrl = uploadResult.data?.url || "";
                } else {
                  mediaUrl = values.url;
                }
                setFieldValue("url", mediaUrl, false);
                submitForm();
              }}
            />
          )}
        </Formik>
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
          await mutationDeleteLocation({
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

export default BreakoutRoomTable;
