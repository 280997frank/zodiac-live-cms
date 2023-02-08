import {
  ApolloError,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { toastr } from "react-redux-toastr";

interface UnknownPayload {
  [s: string]: unknown;
}

export const getAccessToken = (): string => {
  if ((process.env.NEXT_PUBLIC_COOKIE_NAME as string) !== "") {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(
        process.env.NEXT_PUBLIC_COOKIE_NAME as string
      );
      return token !== null ? token : "";
    }
  }

  return "";
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const isEmpty = <T>(value: T): boolean => {
  if (value === null) {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  }

  switch (typeof value) {
    case "undefined":
      return true;
    case "number":
      return value === 0;
    case "string":
      return value.length === 0;
    case "object":
      return Object.keys(value).length === 0;
  }

  return false;
};
export const checkErrorResponse = async (
  response: Response
): Promise<string> => {
  let errorMessage = "";
  const clonedResponse = response.clone();

  if (!response.ok) {
    try {
      const json = await response.json();
      errorMessage = json.message;
    } catch (error) {
      const text = await clonedResponse.text();
      errorMessage = text;
    }
  }

  return errorMessage;
};

export const setOptions = (
  restOptions: UnknownPayload
): Record<string, unknown> => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
  ...restOptions,
});

export const storeAccessToken = async (accessToken: string): Promise<void> => {
  if (typeof process.env.NEXT_PUBLIC_COOKIE_NAME === "string") {
    await window.localStorage.setItem(
      process.env.NEXT_PUBLIC_COOKIE_NAME,
      accessToken
    );
  } else {
    throw new Error("Token cannot be stored");
  }
};

export const removeAccessToken = (): void => {
  if (typeof process.env.NEXT_PUBLIC_COOKIE_NAME === "string") {
    window.localStorage.removeItem(process.env.NEXT_PUBLIC_COOKIE_NAME);
  }
};

export const createApolloClient = (
  token: string,
  errorLink?: ApolloLink
): ApolloClient<NormalizedCacheObject> | undefined => {
  try {
    if (
      typeof process.env.NEXT_PUBLIC_BACKEND_URL !== "string" ||
      process.env.NEXT_PUBLIC_BACKEND_URL.length === 0
    ) {
      throw new Error("Invalid Back-end URL");
    }

    const headers: Record<string, string> = {};

    if (token.length > 0) {
      headers.Authorization = `Bearer ${token}`;
    }

    const links: ApolloLink[] = [
      createUploadLink({
        uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        headers,
      }) as unknown as ApolloLink,
      /* createHttpLink({
        uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
        headers
      }) */
    ];

    if (errorLink instanceof ApolloLink) {
      // NOTE: Result of `createHttpLink` must be put as the last element
      links.unshift(errorLink);
    }

    return new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false,
      }),
      ssrMode: typeof window === "undefined",
      link: from(links),
    });
  } catch (error) {
    toastr.error("Initialization Failed", error.message);
  }
};
