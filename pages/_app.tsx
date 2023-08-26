import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VIAJAH</title>
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
