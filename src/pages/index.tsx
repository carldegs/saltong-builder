import { Stack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../layouts/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack h="full" alignItems="center" justifyContent="center">
        <Link href="/word-search">
          <Button>Word Search</Button>
        </Link>

        <Link href="/saltong/5">
          <Button>Saltong Word Generator</Button>
        </Link>

        <Link href="/saltong/4">
          <Button>Saltong Mini Word Generator</Button>
        </Link>

        <Link href="/saltong/7">
          <Button>Saltong Max Word Generator</Button>
        </Link>
      </Stack>
    </Layout>
  );
};

export default Home;
