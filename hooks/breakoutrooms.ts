import { useErrorMessage } from "@/hooks";
import {
  GetBreakoutHallGalleryArgs,
  GetBreakoutHallGalleryResponse,
  GetLocation,
  GetSessionById,
  Location,
  LocationEditFormSubmit,
  LocationFormSubmit,
  LocationList,
  SessionFormEditSubmit,
  SessionFormResponse,
  SessionFormSubmit,
  SessionList,
  SessionListByLocation,
  UploadBreakoutHallArgs,
  UploadBreakoutHallResponse,
} from "@/types/breakoutrooms";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

//========== QUERY ==========
interface FetchedLocationList {
  listLocation: LocationList;
}

interface FetchedSessionList {
  listSession: SessionList;
}

interface FetchedSessionListByLocation {
  getSessionByLocationId: SessionListByLocation;
}

interface SetLocationInput {
  setLocationInput: {
    sessionId: string;
    locationId: string;
  };
}

interface SetLocationResponse {
  id: string;
}

interface LocationPublishPayload {
  publishLocationInput: {
    id: string;
    isActive: boolean;
  };
}

interface LocationDeletePayload {
  id: string;
}

interface DeleteBreakoutSessionArg {
  id: string;
}

interface DeleteBreakoutSessionResponse {
  id: string;
}

interface PublishBreakoutSessionArg {
  publishSessionInput: {
    id: string;
    isActive: boolean;
  };
}

interface PublishBreakoutSessionResponse {
  id: string;
}

const GET_ALL_SESSIONS = gql`
  query listSession($listSessionInput: ListSessionInput!) {
    listSession(listSessionInput: $listSessionInput) {
      page
      limit
      total
      totalPage
      sessions {
        isActive
        id
        title
        speakers {
          fullname
        }
        location {
          id
          name
        }
        startDate
      }
    }
  }
`;

export const useGetAllSessions = (
  page: number,
  search: string,
  limit: number
) => {
  const [fetchAllSessions, { loading, error, data }] =
    useLazyQuery<FetchedSessionList>(GET_ALL_SESSIONS, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        listSessionInput: {
          page: page,
          limit: limit,
          filter: {
            locationType: "BREAKOUT_ROOM",
          },
          search: {
            title: search,
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchAllSessions,
    loading,
    data,
  };
};

const GET_ALL_SESSIONS_BY_LOCATION = gql`
  query getSessionByLocationId(
    $id: String!
    $listSessionInput: ListSessionInput!
  ) {
    getSessionByLocationId(id: $id, listSessionInput: $listSessionInput) {
      page
      limit
      total
      totalPage
      sessions {
        isActive
        id
        title
        startDate
        endDate
      }
    }
  }
`;

export const useGetAllSessionsByLocation = (
  id: string,
  page: number,
  search: string,
  limit: number
) => {
  const [fetchAllSessionsByLocation, { loading, error, data }] =
    useLazyQuery<FetchedSessionListByLocation>(GET_ALL_SESSIONS_BY_LOCATION, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
        listSessionInput: {
          page: page,
          limit: limit,
          filter: {
            locationType: "BREAKOUT_ROOM",
          },
          search: {
            title: search,
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchAllSessionsByLocation,
    loading,
    data,
  };
};

const GET_SESSION_BY_ID = gql`
  query getSessionById($id: String!) {
    getSessionById(id: $id) {
      id
      title
      description
      speakers {
        id
        fullname
      }
      tags {
        id
        name
      }
      resources {
        url
      }
      startDate
      offsetStart
      timezoneNameStart
      endDate
      offsetEnd
      timezoneNameEnd
      thumbnailUrl
      livestreamUrl
      slido
      getStreamId
    }
  }
`;

export const useGetSessionById = () => {
  const [fetchSessionById, { loading, error, data }] =
    useLazyQuery<GetSessionById>(GET_SESSION_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchSessionById,
    loading,
    data,
  };
};

//==========DELETE BREAKOUT SESSION ====
const DELETE_BREAKOUT_SESSION = gql`
  mutation deleteSession($id: String!) {
    deleteSession(id: $id) {
      id
    }
  }
`;

export const useDeleteBreakoutSession = (
  page: number,
  search: string,
  limit: number
) => {
  const { fetchAllSessions } = useGetAllSessions(page, search, limit);
  const toast = useToast();

  const [fetchDeleteBreakoutSession, { loading, error, data }] = useMutation<
    DeleteBreakoutSessionResponse,
    DeleteBreakoutSessionArg
  >(DELETE_BREAKOUT_SESSION, {
    onCompleted: () => {
      fetchAllSessions();
      toast({
        title: "Session deleted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    fetchDeleteBreakoutSession,
    loading,
    data,
  };
};

export const useDeleteBreakoutDetailSession = (
  id: string,
  page: number,
  search: string,
  limit: number
) => {
  const { fetchAllSessionsByLocation } = useGetAllSessionsByLocation(
    id,
    page,
    search,
    limit
  );
  const toast = useToast();

  const [fetchDeleteBreakoutDetailSession, { loading, error, data }] =
    useMutation<DeleteBreakoutSessionResponse, DeleteBreakoutSessionArg>(
      DELETE_BREAKOUT_SESSION,
      {
        onCompleted: () => {
          fetchAllSessionsByLocation();
          toast({
            title: "Session deleted",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
        },
      }
    );

  useErrorMessage(error);

  return {
    fetchDeleteBreakoutDetailSession,
    loading,
    data,
  };
};

//========== PUBLISH SESSION ===========
const PUBLISH_BREAKOUT_SESSION = gql`
  mutation publishSession($publishSessionInput: PublishSessionInput!) {
    publishSession(publishSessionInput: $publishSessionInput) {
      id
      isActive
    }
  }
`;

export const usePublishBreakoutSession = (
  page: number,
  search: string,
  limit: number
) => {
  const toast = useToast();
  const { fetchAllSessions } = useGetAllSessions(page, search, limit);

  const [fetchPublishBreakoutSession, { loading, error, data }] = useMutation<
    PublishBreakoutSessionResponse,
    PublishBreakoutSessionArg
  >(PUBLISH_BREAKOUT_SESSION, {
    onCompleted: () => {
      fetchAllSessions();
      toast({
        title: "Session changed",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    fetchPublishBreakoutSession,
    loading,
    data,
  };
};

export const usePublishBreakoutDetailSession = (
  id: string,
  page: number,
  search: string,
  limit: number
) => {
  const toast = useToast();
  const { fetchAllSessionsByLocation } = useGetAllSessionsByLocation(
    id,
    page,
    search,
    limit
  );

  const [fetchPublishBreakoutDetailSession, { loading, error, data }] =
    useMutation<PublishBreakoutSessionResponse, PublishBreakoutSessionArg>(
      PUBLISH_BREAKOUT_SESSION,
      {
        onCompleted: () => {
          fetchAllSessionsByLocation();
          toast({
            title: "Session changed",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
        },
      }
    );

  useErrorMessage(error);

  return {
    fetchPublishBreakoutDetailSession,
    loading,
    data,
  };
};

const GET_LOCATION_LIST = gql`
  query listLocation($listLocationInput: ListLocationInput!) {
    listLocation(listLocationInput: $listLocationInput) {
      page
      limit
      total
      totalPage
      locations {
        isActive
        id
        name
        locationType
        sessionLocation {
          total
        }
        locationMediaUrl
      }
    }
  }
`;

export const useGetLocationList = (
  page: number,
  search: string,
  limit: number,
  filter: string | null = "BREAKOUT_ROOM"
) => {
  const [fetchLocationList, { loading, error, data }] =
    useLazyQuery<FetchedLocationList>(GET_LOCATION_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        listLocationInput: {
          page: page,
          limit: limit,
          search: {
            name: search,
          },
          filter: {
            locationType: filter,
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchLocationList,
    loading,
    data,
  };
};

// =========== GET LOCATION =============
const GET_LOCATION = gql`
  query getLocation($id: String!) {
    getLocation(id: $id) {
      id
      name
      locationMediaUrl
      sessionLocation {
        sessions {
          id
          title
        }
      }
    }
  }
`;

export const useGetLocation = () => {
  const [fetchLocation, { loading, error, data }] = useLazyQuery<GetLocation>(
    GET_LOCATION,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);

  return {
    fetchLocation,
    loading,
    data,
  };
};

//========== INSERT LOCATION MUTATION ==========
const MUTATION_LOCATION_INSERT = gql`
  mutation addLocation($addLocationInput: AddLocationInput!) {
    addLocation(addLocationInput: $addLocationInput) {
      id
    }
  }
`;

export const useAddLocation = (page: number, search: string, limit: number) => {
  const { fetchLocationList } = useGetLocationList(page, search, limit);

  const [mutationAddLocation, { loading, error, data }] = useMutation<
    LocationList,
    LocationFormSubmit
  >(MUTATION_LOCATION_INSERT, {
    onCompleted: () => {
      fetchLocationList();
    },
  });

  useErrorMessage(error);

  return {
    mutationAddLocation,
    loading,
    data,
  };
};

//========== UPDATE LOCATION MUTATION ==========
const MUTATION_LOCATION_UPDATE = gql`
  mutation editLocation($editLocationInput: EditLocationInput!) {
    editLocation(editLocationInput: $editLocationInput) {
      id
    }
  }
`;

export const useEditLocation = () => {
  const toast = useToast();
  const router = useRouter();

  const [mutationEditLocation, { loading, error, data }] = useMutation<
    LocationList,
    LocationEditFormSubmit
  >(MUTATION_LOCATION_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/breakout-rooms");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditLocation,
    loading,
    data,
  };
};

//========== PUBLISH LOCATION MUTATION ==========
const MUTATION_LOCATION_PUBLISH = gql`
  mutation publishLocation($publishLocationInput: PublishLocationInput!) {
    publishLocation(publishLocationInput: $publishLocationInput) {
      id
      name
      locationType
      sessionLocation {
        total
      }
      locationMediaUrl
      isActive
    }
  }
`;

export const usePublishLocation = (
  page: number,
  search: string,
  limit: number
) => {
  const { fetchLocationList } = useGetLocationList(page, search, limit);
  const [mutationPublishLocation, { loading, error, data }] = useMutation<
    Location,
    LocationPublishPayload
  >(MUTATION_LOCATION_PUBLISH, {
    onCompleted: () => {
      fetchLocationList();
    },
  });

  useErrorMessage(error);

  return {
    mutationPublishLocation,
    loading,
    data,
  };
};

//========== DELETE LOCATION MUTATION ==========
const MUTATION_LOCATION_DELETE = gql`
  mutation deleteLocation($id: String!) {
    deleteLocation(id: $id) {
      id
      name
      locationType
      sessionLocation {
        total
      }
      locationMediaUrl
      isActive
    }
  }
`;

export const useDeleteLocation = (
  page: number,
  search: string,
  limit: number
) => {
  const toast = useToast();
  const { fetchLocationList } = useGetLocationList(page, search, limit);
  const [mutationDeleteLocation, { loading, error, data }] = useMutation<
    Location,
    LocationDeletePayload
  >(MUTATION_LOCATION_DELETE, {
    onCompleted: () => {
      fetchLocationList();
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    mutationDeleteLocation,
    loading,
    data,
  };
};

//========== INSERT SESSION MUTATION ==========
const MUTATION_SESSION_INSERT = gql`
  mutation addSession($addSessionInput: AddSessionInput!) {
    addSession(addSessionInput: $addSessionInput) {
      id
    }
  }
`;

export const useBreakoutSessionInsert = () => {
  const toast = useToast();
  const router = useRouter();

  const [mutationAddBreakoutSession, { loading, error, data }] = useMutation<
    SessionFormResponse,
    SessionFormSubmit
  >(MUTATION_SESSION_INSERT, {
    onCompleted: () => {
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/breakout-rooms");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddBreakoutSession,
    loading,
    data,
  };
};

//========== UPDATE SESSION MUTATION ==========
const MUTATION_SESSION_UPDATE = gql`
  mutation editSession($editSessionInput: EditSessionInput!) {
    editSession(editSessionInput: $editSessionInput) {
      id
    }
  }
`;

export const useBreakoutSessionUpdate = () => {
  const toast = useToast();
  const router = useRouter();

  const [mutationEditBreakoutSession, { loading, error, data }] = useMutation<
    SessionList,
    SessionFormEditSubmit
  >(MUTATION_SESSION_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/breakout-rooms");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditBreakoutSession,
    loading,
    data,
  };
};

//========== SET LOCATION MUTATION ==========
const MUTATION_SET_LOCATION = gql`
  mutation setLocation($setLocationInput: SetLocationInput!) {
    setLocation(setLocationInput: $setLocationInput) {
      id
    }
  }
`;

export const useSetLocation = (page: number, search: string, limit: number) => {
  const toast = useToast();
  const { fetchAllSessions } = useGetAllSessions(page, search, limit);
  const [mutationSetLocation, { loading, error, data }] = useMutation<
    SetLocationResponse,
    SetLocationInput
  >(MUTATION_SET_LOCATION, {
    onCompleted: () => {
      fetchAllSessions();
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    mutationSetLocation,
    loading,
    data,
  };
};

//========== UPLOAD BREAKOUT HALL MUTATION ==========
const MUTATION_UPLOAD_BREAKOUT_HALL = gql`
  mutation upsertMultiFiles($param: [UpsertFilesInput!]!) {
    upsertMultiFiles(param: $param) {
      url
      imageId
    }
  }
`;

export const useUploadBreakoutHall = () => {
  const toast = useToast();
  const { fetchBreakoutHallGallery } = useGetBreakoutHallGallery();
  const [mutationUploadBreakoutHall, { loading, error, data }] = useMutation<
    UploadBreakoutHallResponse,
    UploadBreakoutHallArgs
  >(MUTATION_UPLOAD_BREAKOUT_HALL, {
    onCompleted: () => {
      fetchBreakoutHallGallery({
        variables: {
          getGalleryInput: {
            folder: "BREAKOUT_HALL",
          },
        },
      });
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    mutationUploadBreakoutHall,
    loading,
    data,
  };
};

//========== GET BREAKOUT HALL GALLERY QUERY ==========
const QUERY_GET_BREAKOUT_HALL_GALLERY = gql`
  query getGalleries($getGalleryInput: GetGalleryInput!) {
    getGalleries(getGalleryInput: $getGalleryInput) {
      folder
      url
      id
    }
  }
`;

export const useGetBreakoutHallGallery = () => {
  const [fetchBreakoutHallGallery, { loading, error, data }] = useLazyQuery<
    GetBreakoutHallGalleryResponse,
    GetBreakoutHallGalleryArgs
  >(QUERY_GET_BREAKOUT_HALL_GALLERY, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  useErrorMessage(error);

  return {
    fetchBreakoutHallGallery,
    loading,
    data,
  };
};
