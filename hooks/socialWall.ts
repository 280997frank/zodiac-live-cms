import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { useErrorMessage } from "@/hooks";
import { TGetSocialWall } from "@/types/socialwall";

interface SocialWallInput {
  setSocialWallInput: {
    url: string;
  };
}
interface SocialWallResponse {
  id: string;
  url: string;
}
//=========GET SOcial Wall ===
const GET_Socialwall = gql`
  query {
    getSocialWall {
      id
      url
    }
  }
`;

export const useSocialWall = () => {
  const [fetchSocialWall, { loading, error, data }] =
    useLazyQuery<TGetSocialWall>(GET_Socialwall, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchSocialWall,
    loading,
    data,
  };
};

//==========MUTATTION Social Wall ====
const MUTATTION_SOCIALWALL = gql`
  mutation setSocialWall($setSocialWallInput: SocialWallInput!) {
    setSocialWall(setSocialWallInput: $setSocialWallInput) {
      id
      url
    }
  }
`;

export const useMutationSocialWall = () => {
  const toast = useToast();
  const { fetchSocialWall } = useSocialWall();

  const [fetchMutationSocialWall, { loading, error, data }] = useMutation<
    SocialWallResponse,
    SocialWallInput
  >(MUTATTION_SOCIALWALL, {
    onCompleted: () => {
      fetchSocialWall();
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
    fetchMutationSocialWall,
    loading,
    data,
  };
};
