import React, { FC, ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Center,
  FormControl,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { object } from "yup";

import Meta from "@/components/Atoms/Meta";
import TextInput from "@/components/Atoms/TextInput";
import { default as ButtonForm } from "@/components/Atoms/Button";
import PasswordInput from "@/components/Atoms/PasswordInput";

import { requiredEmail, requiredString } from "@/constants/validationSchema";
import { BG_GRADIENT } from "@/constants/ui";

import { actions as authActions } from "@/states/auth/slice";

import { getAccessToken, storeAccessToken } from "@/utils";

import { useAppDispatch } from "@/hooks";
import { useLoginSubmit } from "@/hooks/auth";

const LoginPage: FC = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>ZodiacLive CMS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Meta />
      <Login />
    </div>
  );
};

const logo = "https://picsum.photos/200";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = object({
  email: requiredEmail,
  password: requiredString,
});

const Login: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [isCheckingLoginStatus, setLoginCheckingStatus] = useState(true);
  const { loginSubmit, response, loading } = useLoginSubmit();

  // get response login
  useEffect(() => {
    if (response) {
      storeAccessToken(response.login.accessToken);
      setLoginStatus(true);
      dispatch(authActions.setUserId(response.login.userId));
    }
  }, [response, dispatch]);

  // check and set status is already login
  useEffect(() => {
    const token = getAccessToken();

    if (token.length > 0) {
      setLoginStatus(true);
    } else {
      setLoginCheckingStatus(false);
    }
  }, []);

  // redirect if already login
  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/landing-page";
    }
  }, [isLoggedIn]);

  if (isCheckingLoginStatus) {
    return <Center h="100vh">Loading ......</Center>;
  }

  return (
    <Stack
      direction={["column"]}
      background={BG_GRADIENT}
      height="100vh"
      position="relative"
    >
      <Center h="100%">
        <Box
          flexGrow={0}
          bg="white"
          minWidth="20vw"
          backdropFilter="blur(40px)"
          borderRadius="1rem"
          p="3rem"
          m="0 auto"
          position="relative"
        >
          <Box p={4}>
            <Center mb={4}>
              <Box>
                <Image src={logo} alt="Zodiac Live" />
              </Box>
            </Center>
            <Center mb={4}>
              <Heading as="h1" size="lg">
                Content Management System
              </Heading>
            </Center>
          </Box>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await loginSubmit({
                variables: {
                  email: values.email,
                  password: values.password,
                },
              });
            }}
          >
            {() => {
              return (
                <Form>
                  <TextInput id="email" name="email" label="EMAIL" />
                  <PasswordInput
                    id="password"
                    name="password"
                    label="PASSWORD"
                    mb={10}
                    mt={4}
                  />
                  <FormControl>
                    <ButtonForm
                      label="LOGIN"
                      type="submit"
                      className="login"
                      isLarge={true}
                      isLoading={loading}
                    />
                  </FormControl>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Center>
    </Stack>
  );
};

export default LoginPage;
