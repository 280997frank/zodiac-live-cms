import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { useErrorMessage } from "@/hooks";
import { TGetFeedback } from "@/types/feedback";

interface FeedbackInput {
  setFeedbackInput: {
    url: string;
  };
}
interface FeedbackResponse {
  id: string;
  url: string;
}
//=========GET FEEDBACK ===
const GET_FeedBack = gql`
  query {
    getFeedback {
      id
      url
    }
  }
`;

export const useFeedback = () => {
  const [fetchFeedback, { loading, error, data }] = useLazyQuery<TGetFeedback>(
    GET_FeedBack,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);

  return {
    fetchFeedback,
    loading,
    data,
  };
};

//==========MUTATTION FEEDBACK ====
const MUTATTION_FEEDBACK = gql`
  mutation setFeedback($setFeedbackInput: FeedbackInput!) {
    setFeedback(setFeedbackInput: $setFeedbackInput) {
      id
      url
    }
  }
`;

export const useMutationFeedback = () => {
  const toast = useToast();
  const { fetchFeedback } = useFeedback();

  const [fetchMutationFeedback, { loading, error, data }] = useMutation<
    FeedbackResponse,
    FeedbackInput
  >(MUTATTION_FEEDBACK, {
    onCompleted: () => {
      fetchFeedback();
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
    fetchMutationFeedback,
    loading,
    data,
  };
};
