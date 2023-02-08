import { LoginPayload, LoginResponse } from "@/types/auth";
import { useMutation, gql } from "@apollo/client";
import { useErrorMessage } from ".";

const MUTATION_LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(paramLogin: { email: $email, password: $password }) {
      email
      username
      accessToken
      loginAt
      userId
    }
  }
`;

interface ResponseLoginMutation {
  login: LoginResponse;
}

export const useLoginSubmit = () => {
  const [loginSubmit, { data: response, error, loading }] = useMutation<
    ResponseLoginMutation,
    LoginPayload
  >(MUTATION_LOGIN);

  useErrorMessage(error);

  return {
    loginSubmit,
    response,
    loading,
  };
};
