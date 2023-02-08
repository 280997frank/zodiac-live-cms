import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useErrorMessage } from "@/hooks/index";
import {
  AddVod,
  DataListVod,
  EditVod,
  GetVodById,
  RemoveVod,
  ResponseAddVod,
  ResponseEditVod,
  ResponseGetVodById,
  ResponseRemoveVod,
  ResponseToggleStatusVod,
  ToggleStatusVod,
} from "@/types/vod";
import { useToast } from "@chakra-ui/react";
import { useListSession } from "@/hooks/resource-center";

//=== GET LIST VOD ======
const LIST_VOD = gql`
  query listVod($listVodInput: ListVodInput!) {
    listVod(listVodInput: $listVodInput) {
      page
      limit
      total
      totalPage
      vods {
        id
        active
        title
        url
        thumbnailUrl
        sessionDate
        session {
          id
          title
          thumbnailUrl
          isActive
          location {
            id
            name
            sessionLocation {
              total
              sessions {
                id
                title
              }
            }
            locationType
          }
        }
        sessionDate
      }
    }
  }
`;

export const useListVod = (body: any) => {
  const [fetchListVod, { loading, error, data }] = useLazyQuery<DataListVod>(
    LIST_VOD,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);
  return {
    fetchListVod,
    loading,
    data,
  };
};

//=== GET VOD BY ID ======
const GET_VOD_BY_ID = gql`
  query getVodById($detailVodInput: DetailVodInput!) {
    getVodById(detailVodInput: $detailVodInput) {
      id
      active
      title
      url
      thumbnailUrl
      session {
        id
      }
      sessionDate
      sessionDateZoneName
      sessionDateOffset
    }
  }
`;

export const useGetVodById = (body: any) => {
  const [fetchGetVodById, { loading, error, data }] = useLazyQuery<GetVodById>(
    GET_VOD_BY_ID,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);
  return {
    fetchGetVodById,
    loading,
    data,
  };
};

// ==== CHANGE STATUS VOD ======
const TOGGLE_STATUS_VOD = gql`
  mutation toggleStatusVod($toggleStatusVodInput: ToggleStatusVodInput!) {
    toggleStatusVod(toggleStatusVodInput: $toggleStatusVodInput) {
      id
    }
  }
`;

export const useToggleStatusVod = () => {
  const toast = useToast();
  const [fetchToggleStatusVod, { loading, error, data }] = useMutation<
    ResponseToggleStatusVod,
    ToggleStatusVod
  >(TOGGLE_STATUS_VOD, {
    onCompleted: () => {
      toast({
        title: "Update Status Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchToggleStatusVod,
    loading,
    data,
  };
};

// === DELETE VOD ======
const REMOVE_VOD = gql`
  mutation removeVod($removeVodInput: RemoveVodInput!) {
    removeVod(removeVodInput: $removeVodInput) {
      status
    }
  }
`;

export const useRemoveVod = () => {
  const toast = useToast();
  const [fetchRemoveVod, { loading, error, data }] = useMutation<
    ResponseRemoveVod,
    RemoveVod
  >(REMOVE_VOD, {
    onCompleted: () => {
      toast({
        title: "Delete Status Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchRemoveVod,
    loading,
    data,
  };
};

// === ADD VOD ======
const ADD_VOD = gql`
  mutation addVod($addVodInput: AddVodInput!) {
    addVod(addVodInput: $addVodInput) {
      id
    }
  }
`;

export const useAddVod = () => {
  const toast = useToast();
  const [fetchAddVod, { loading, error, data }] = useMutation<
    ResponseAddVod,
    AddVod
  >(ADD_VOD, {
    onCompleted: () => {
      toast({
        title: "Add Video On Demand Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchAddVod,
    loading,
    data,
  };
};

//==== EDIT VOD ====
const EDIT_VOD = gql`
  mutation editVod($editVodInput: EditVodInput!) {
    editVod(editVodInput: $editVodInput) {
      id
    }
  }
`;

export const useEditVod = () => {
  const toast = useToast();
  const [fetchEditVod, { loading, error, data }] = useMutation<
    ResponseEditVod,
    EditVod
  >(EDIT_VOD, {
    onCompleted: () => {
      toast({
        title: "Edit Video On Demand Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchEditVod,
    loading,
    data,
  };
};
