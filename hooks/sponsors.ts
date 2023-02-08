import {
  ResponseSponsorsAdd,
  ResponseSponsorsById,
  ResponseSponsorsEdit,
  ResponseSponsorsList,
  ResponseSponsorsRemove,
  ResponseSponsorsUpdateToggle,
  TSponsors,
  TSponsorsAddPayload,
  TSponsorsEditPayload,
  TSponsorsRemovePayload,
  TSponsorsUpdateTogglePayload,
} from "@/types/sponsors";
import { useMutation, gql, useLazyQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useErrorMessage } from ".";

/**
 * LIST
 */
const QUERY_LIST = gql`
  query listSponsors($page: Int, $limit: Int, $search: String) {
    listSponsors(
      listSponsorInput: {
        page: $page
        limit: $limit
        search: { keyword: $search }
      }
    ) {
      page
      limit
      total
      totalPage
      sponsors {
        id
        name
        active
      }
    }
  }
`;

interface ListProps {
  page: number;
  limit: number;
  search: string;
}

export const useSponsorList = ({ page, limit, search }: ListProps) => {
  const [fetchMore, { loading, error, data: response }] =
    useLazyQuery<ResponseSponsorsList>(QUERY_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        page: page,
        limit: limit,
        search: search,
      },
    });

  useErrorMessage(error);

  return {
    fetchMore,
    response,
    loading,
  };
};

/**
 * DETAIL
 */
const QUERY_DETAIL = gql`
  query getSponsorById($id: ID!) {
    getSponsorById(detailSponsorInput: { id: $id }) {
      id
      name
      url
      logo
    }
  }
`;

export const useSponsorDetail = (id: string) => {
  const [getSponsor, { loading, error, data: response }] =
    useLazyQuery<ResponseSponsorsById>(QUERY_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
    });

  useErrorMessage(error);

  return {
    getSponsor,
    response,
    loading,
  };
};

/**
 * ADD
 */
const MUTATION_ADD = gql`
  mutation addSponsor($name: String!, $url: String!, $logo: String) {
    addSponsor(addSponsorInput: { name: $name, url: $url, logo: $logo }) {
      id
      name
      url
      logo
    }
  }
`;

export const useSponsorAddSubmit = () => {
  const toast = useToast();
  const [sponsorAddSubmit, { data: response, error, loading }] = useMutation<
    ResponseSponsorsAdd,
    TSponsorsAddPayload
  >(MUTATION_ADD, {
    onCompleted: () => {
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
    sponsorAddSubmit,
    response,
    loading,
  };
};

/**
 * EDIT
 */
const MUTATION_EDIT = gql`
  mutation editSponsor($name: String!, $url: String!, $logo: String, $id: ID!) {
    editSponsor(
      editSponsorInput: { name: $name, url: $url, logo: $logo, id: $id }
    ) {
      id
      name
      url
      logo
    }
  }
`;

export const useSponsorEditSubmit = () => {
  const toast = useToast();
  const [sponsorEditSubmit, { data: response, error, loading }] = useMutation<
    ResponseSponsorsEdit,
    TSponsorsEditPayload
  >(MUTATION_EDIT, {
    onCompleted: () => {
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
    sponsorEditSubmit,
    response,
    loading,
  };
};

/**
 * REMOVE
 */
const MUTATION_REMOVE = gql`
  mutation removeSponsor($id: ID!) {
    removeSponsor(removeSponsorInput: { id: $id }) {
      status
    }
  }
`;

export const useSponsorRemove = () => {
  const toast = useToast();
  const [sponsorRemove, { data: response, error, loading }] = useMutation<
    ResponseSponsorsRemove,
    TSponsorsRemovePayload
  >(MUTATION_REMOVE, {
    onCompleted: () => {
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
    sponsorRemove,
    response,
    loading,
  };
};

/**
 * TOGGLE STATUS
 */
const TOGGLE_STATUS_UPDATE = gql`
  mutation toggleStatusSponsor($id: ID!, $status: Boolean!) {
    toggleStatusSponsor(toggleStatusInput: { id: $id, status: $status }) {
      id
      name
      active
    }
  }
`;

export const useSponsorToggleStatus = () => {
  const toast = useToast();
  const [sponsorToggleStatus, { data: response, error, loading }] = useMutation<
    ResponseSponsorsUpdateToggle,
    TSponsorsUpdateTogglePayload
  >(TOGGLE_STATUS_UPDATE, {
    onCompleted: () => {
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
    sponsorToggleStatus,
    response,
    loading,
  };
};
