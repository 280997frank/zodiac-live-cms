import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import dayjsUTC from "dayjs/plugin/utc";
import dayjsCustomFormatParser from "dayjs/plugin/customParseFormat";

import { timezone } from "constants/timezone";

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsCustomFormatParser);

export enum RoundtableField {
  Id = "id",
  Title = "title",
  Description = "description",
  StartDate = "startDate",
  StartTime = "startTime",
  OffsetStart = "offsetStart",
  EndDate = "endDate",
  EndTime = "endTime",
  OffsetEnd = "offsetEnd",
  TimezoneNameStart = "timezoneNameStart",
  TimezoneNameEnd = "timezoneNameEnd",
  Host = "host",
  Capacity = "capacity",
  IsPasswordActive = "isPasswordActive",
  Password = "password",
  ThumbnailUrl = "thumbnailUrl",
}

type RoundtableData = {
  [RoundtableField.Id]?: string;
  [RoundtableField.Title]: string;
  [RoundtableField.Description]: string;
  [RoundtableField.StartDate]: string;
  [RoundtableField.EndDate]: string;
  [RoundtableField.TimezoneNameStart]: string;
  [RoundtableField.TimezoneNameEnd]: string;
  [RoundtableField.Host]: string;
  [RoundtableField.Capacity]: string;
  [RoundtableField.IsPasswordActive]: boolean;
  [RoundtableField.Password]: string;
  [RoundtableField.ThumbnailUrl]: string;
  offsetStart: number;
  offsetEnd: number;
};

export type RoundtableFormData = Omit<
  RoundtableData,
  "offsetStart" | "offsetEnd"
> & {
  [RoundtableField.StartTime]: string;
  [RoundtableField.EndTime]: string;
};

type RoundtableResponse = {
  roundtable: RoundtableData;
};

type RoundtableUpdateResponse = {
  return: {
    id: string;
    at: number;
  };
};

type RoundtableUploadResponse = {
  uploaded: {
    url: string;
    imageId: string;
  };
};

type RoundtableUploadVars = {
  file: string;
};

const ROUNDTABLE_QUERY = gql`
  query getRoundtableData($id: String = "60efe60792137b65dbfe57ae") {
    roundtable: getSessionById(id: $id) {
      title
      description
      startDate
      offsetStart
      endDate
      offsetEnd
      timezoneNameStart
      timezoneNameEnd
      host: hostName
      capacity
      isPasswordActive
      password
      thumbnailUrl
    }
  }
`;

const ROUNDTABLE_UPDATE_MUTATION = gql`
  mutation updateRoundtable(
    $id: String!
    $title: String!
    $description: String!
    $startDate: DateTime!
    $offsetStart: Float!
    $timezoneNameStart: String!
    $endDate: DateTime!
    $offsetEnd: Float!
    $timezoneNameEnd: String!
    $host: String!
    $capacity: SessionCapacityType!
    $isPasswordActive: Boolean
    $password: String!
    $thumbnailUrl: String!
  ) {
    return: editSession(
      editSessionInput: {
        id: $id
        title: $title
        description: $description
        startDate: $startDate
        offsetStart: $offsetStart
        timezoneNameStart: $timezoneNameStart
        endDate: $endDate
        offsetEnd: $offsetEnd
        timezoneNameEnd: $timezoneNameEnd
        hostName: $host
        capacity: $capacity
        isPasswordActive: $isPasswordActive
        password: $password
        thumbnailUrl: $thumbnailUrl
        locationType: ROUNDTABLE
      }
    ) {
      id
      at: updatedAt
    }
  }
`;

const ROUNDTABLE_CREATE_MUTATION = gql`
  mutation addRoundtable(
    $title: String!
    $description: String!
    $startDate: DateTime!
    $offsetStart: Float!
    $timezoneNameStart: String!
    $endDate: DateTime!
    $offsetEnd: Float!
    $timezoneNameEnd: String!
    $host: String
    $capacity: SessionCapacityType
    $password: String
    $isPasswordActive: Boolean
    $thumbnailUrl: String!
  ) {
    return: addSession(
      addSessionInput: {
        title: $title
        description: $description
        startDate: $startDate
        offsetStart: $offsetStart
        timezoneNameStart: $timezoneNameStart
        endDate: $endDate
        offsetEnd: $offsetEnd
        timezoneNameEnd: $timezoneNameEnd
        hostName: $host
        capacity: $capacity
        password: $password
        isPasswordActive: $isPasswordActive
        thumbnailUrl: $thumbnailUrl
        locationType: ROUNDTABLE
      }
    ) {
      id
      at: createdAt
    }
  }
`;

const ROUNDTABLE_UPLOAD_IMAGE_MUTATION = gql`
  mutation uploadThumbnail($file: Upload!) {
    uploaded: uploadFile(
      uploadFilesInput: { file: $file, folder: ROUNDTABLE }
    ) {
      url
      imageId
    }
  }
`;

const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "HH:mm";
const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;
const DATE_MUTATION_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

const useRoundTableForm = (isNewSession: boolean = false) => {
  const toast = useToast();
  const {
    query: { id },
    push: routerPush,
  } = useRouter();

  const now = dayjs(new Date());
  const [initialValues, setInitialValues] = useState<RoundtableFormData>({
    [RoundtableField.Title]: "",
    [RoundtableField.Description]: "",
    [RoundtableField.StartDate]: now.format(DATE_FORMAT),
    [RoundtableField.StartTime]: now.format(TIME_FORMAT),
    [RoundtableField.EndDate]: now.add(1, "day").format(DATE_FORMAT),
    [RoundtableField.EndTime]: now.add(1, "hour").format(TIME_FORMAT),
    [RoundtableField.TimezoneNameStart]: "EST",
    [RoundtableField.TimezoneNameEnd]: "EST",
    [RoundtableField.Host]: "Host Name",
    [RoundtableField.Capacity]: "TWO",
    [RoundtableField.IsPasswordActive]: false,
    [RoundtableField.Password]: "",
    [RoundtableField.ThumbnailUrl]: "",
  });

  // Smooth loading, replace loading from apollo
  const [isFetching, setFetchingStatus] = useState(true);
  const [fetchRoundtable, { error: isFetchError }] =
    useLazyQuery<RoundtableResponse>(ROUNDTABLE_QUERY, {
      fetchPolicy: "network-only",
      onCompleted(response) {
        const roundtable = response?.roundtable ?? null;
        if (roundtable) {
          const startDate = dayjs(new Date(roundtable.startDate)).utcOffset(
            roundtable.offsetStart
          );

          const endDate = dayjs(new Date(roundtable.endDate)).utcOffset(
            roundtable.offsetEnd
          );

          setInitialValues({
            ...roundtable,
            [RoundtableField.StartDate]: startDate.format(DATE_FORMAT),
            [RoundtableField.StartTime]: startDate.format(TIME_FORMAT),
            [RoundtableField.EndDate]: endDate.format(DATE_FORMAT),
            [RoundtableField.EndTime]: endDate.format(TIME_FORMAT),
          });
          setFetchingStatus(false);
        }
      },
    });

  // add roundtable
  const [addRoundtable, { error: isAddingError, data: addReturn }] =
    useMutation<RoundtableUpdateResponse, RoundtableData>(
      ROUNDTABLE_CREATE_MUTATION
    );

  // edit roundtable
  const [updateRoundtable, { error: isUpdateError, data: updateReturn }] =
    useMutation<RoundtableUpdateResponse, RoundtableData>(
      ROUNDTABLE_UPDATE_MUTATION
    );

  // upload image
  const [uploadThumbnail, { error: isUploadThumbnailError }] = useMutation<
    RoundtableUploadResponse,
    RoundtableUploadVars
  >(ROUNDTABLE_UPLOAD_IMAGE_MUTATION);

  const formik = useFormik<RoundtableFormData>({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (values.thumbnailUrl) {
        const { data } = await uploadThumbnail({
          variables: {
            file: values.thumbnailUrl,
          },
        });
        values.thumbnailUrl = data?.uploaded?.url ?? "";
      }

      const { offset: offsetStart = 7 } =
        timezone.find((item) => item.abbr === values.timezoneNameStart) || {};

      const { offset: offsetEnd = 7 } =
        timezone.find((item) => item.abbr === values.timezoneNameEnd) || {};

      const startDate = dayjs(
        `${values.startDate} ${values.startTime}`,
        DATE_TIME_FORMAT
      )
        .utcOffset(offsetStart)
        .format(DATE_MUTATION_FORMAT);

      const endDate = dayjs(
        `${values.endDate} ${values.endTime}`,
        DATE_TIME_FORMAT
      )
        .utcOffset(offsetEnd)
        .format(DATE_MUTATION_FORMAT);

      const { startTime, endTime, ...cleanValues } = values;

      if (isNewSession) {
        const { data } = await addRoundtable({
          variables: {
            ...cleanValues,
            startDate,
            endDate,
            offsetStart,
            offsetEnd,
          },
        });
        if (data?.return?.id) {
          routerPush(`/roundtable/${data.return.id}`);
        }
        return;
      }

      await updateRoundtable({
        variables: {
          ...cleanValues,
          id: <string>id,
          startDate,
          endDate,
          offsetStart,
          offsetEnd,
        },
      });
      setSubmitting(false);
    },
  });

  const error = useMemo(
    () =>
      isFetchError || isUpdateError || isAddingError || isUploadThumbnailError,
    [isFetchError, isUpdateError, isAddingError, isUploadThumbnailError]
  );

  const isSuccess = useMemo(
    () => updateReturn || addReturn,
    [updateReturn, addReturn]
  );

  const onCancel = useCallback(() => {
    routerPush("/roundtable");
  }, [routerPush]);

  // on success update / add new
  useEffect(() => {
    if (isSuccess) {
      toast({
        isClosable: true,
        title: isNewSession
          ? "Success adding new session"
          : "Success update current session",
        position: "bottom",
        status: "success",
      });
    }
  }, [isSuccess, isNewSession, toast]);

  // fetch data on load
  useEffect(() => {
    if (!isNewSession) {
      setFetchingStatus(true);
      fetchRoundtable({
        variables: {
          id,
        },
      });
    }
  }, [fetchRoundtable, id, isNewSession]);

  useEffect(() => {
    if (isNewSession) {
      setFetchingStatus(false);
    }
  }, [isNewSession]);

  return {
    formik,
    updateReturn,
    isFetching,
    isSuccess,
    error,
    onCancel,
  };
};

export default useRoundTableForm;
