import { useErrorMessage } from "@/hooks";
import {
  Auditorium,
  AuditoriumFormEditSubmit,
  AuditoriumFormSubmit,
  AuditoriumList,
  DeleteSessionArg,
  DeleteSessionResponse,
  PublishSessionArg,
  PublishSessionResponse,
} from "@/types/auditorium";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

//========== QUERY ==========
interface FetchedAuditoriumList {
  listSession: AuditoriumList;
}

const GET_AUDITORIUM_LIST = gql`
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
        startDate
        endDate
      }
    }
  }
`;

export const useAuditoriumPageList = (
  page: number,
  search: string,
  limit: number,
  filterDate: string
) => {
  const [fetchAuditoriumPageList, { loading, error, data }] =
    useLazyQuery<FetchedAuditoriumList>(GET_AUDITORIUM_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        listSessionInput: {
          page: page,
          limit: limit,
          search: {
            title: search,
          },
          filter: {
            locationType: "AUDITORIUM",
            startDate: filterDate,
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchAuditoriumPageList,
    loading,
    data,
  };
};

const GET_AUDITORIUM = gql`
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

export const useGetAuditorium = () => {
  const [fetchAuditorium, { loading, error, data }] = useLazyQuery<Auditorium>(
    GET_AUDITORIUM,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);

  return {
    fetchAuditorium,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
const MUTATION_AUDITORIUM_INSERT = gql`
  mutation addSession($addSessionInput: AddSessionInput!) {
    addSession(addSessionInput: $addSessionInput) {
      id
    }
  }
`;

export const useAuditoriumInsert = () => {
  const toast = useToast();
  const router = useRouter();

  const [mutationAddAuditorium, { loading, error, data }] = useMutation<
    AuditoriumList,
    AuditoriumFormSubmit
  >(MUTATION_AUDITORIUM_INSERT, {
    onCompleted: () => {
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/auditorium");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddAuditorium,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
const MUTATION_AUDITORIUM_UPDATE = gql`
  mutation editSession($editSessionInput: EditSessionInput!) {
    editSession(editSessionInput: $editSessionInput) {
      id
    }
  }
`;

export const useAuditoriumUpdate = () => {
  const toast = useToast();
  const router = useRouter();

  const [mutationEditAuditorium, { loading, error, data }] = useMutation<
    AuditoriumList,
    AuditoriumFormEditSubmit
  >(MUTATION_AUDITORIUM_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/auditorium");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditAuditorium,
    loading,
    data,
  };
};

//==========DELETE SESSION ====
const DELETE_SESSION = gql`
  mutation deleteSession($id: String!) {
    deleteSession(id: $id) {
      id
    }
  }
`;

export const useDeleteSession = (
  page: number,
  search: string,
  limit: number,
  filter: string
) => {
  const { fetchAuditoriumPageList } = useAuditoriumPageList(
    page,
    search,
    limit,
    filter
  );
  const toast = useToast();

  const [fetchDeleteSession, { loading, error, data }] = useMutation<
    DeleteSessionResponse,
    DeleteSessionArg
  >(DELETE_SESSION, {
    onCompleted: () => {
      fetchAuditoriumPageList();
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
    fetchDeleteSession,
    loading,
    data,
  };
};

//========== PUBLISH SESSION ===========
const PUBLISH_SESSION = gql`
  mutation publishSession($publishSessionInput: PublishSessionInput!) {
    publishSession(publishSessionInput: $publishSessionInput) {
      id
      isActive
    }
  }
`;

export const usePublishSession = (
  page: number,
  search: string,
  limit: number,
  filter: string
) => {
  const { fetchAuditoriumPageList } = useAuditoriumPageList(
    page,
    search,
    limit,
    filter
  );
  const toast = useToast();

  const [fetchPublishSession, { loading, error, data }] = useMutation<
    PublishSessionResponse,
    PublishSessionArg
  >(PUBLISH_SESSION, {
    onCompleted: () => {
      fetchAuditoriumPageList();
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
    fetchPublishSession,
    loading,
    data,
  };
};
