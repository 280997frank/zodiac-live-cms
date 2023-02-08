import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PersistGate } from "redux-persist/integration/react";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

import { store, persistor } from "@/states/store";
import { getAccessToken, createApolloClient } from "@/utils";

import "@/styles/globals.css";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Poppins, sans-serif",
  },
});

const client = createApolloClient(getAccessToken());

function MyApp({ Component, pageProps }: AppProps) {
  if (client instanceof ApolloClient) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ChakraProvider theme={theme}>
              <DndProvider backend={HTML5Backend}>
                <Component {...pageProps} />
                <ReduxToastr />
              </DndProvider>
            </ChakraProvider>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    );
  }

  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Something wrong happens</h1>
    </section>
  );
}
export default MyApp;
