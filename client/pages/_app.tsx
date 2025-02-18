import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper, makeStore, persistor } from "@/redux/store";
import Layout from "@/app/Layout";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  const store = makeStore(); // ✅ Correct way to create store

  return (
    <MantineProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </MantineProvider>
  );
}

export default wrapper.withRedux(App);
