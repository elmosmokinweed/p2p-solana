import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from 'src/components/atoms/Typography';
import { Header } from 'src/components/molecules/Header';
import { Container } from 'src/components/templates/Container';
import { TradeConfirmation } from 'src/components/organisms/TradeConfirmation';

require('@solana/wallet-adapter-react-ui/styles.css');

const ConfirmTrade: NextPage = () => {
  const router = useRouter();
  console.log(router.asPath);

  return (
    <>
      <Head>
        <title>Confirm swap</title>
      </Head>
      <Header isConnected={true} />
      <Container>
        <TradeConfirmation />
      </Container>
    </>
  );
};

export default ConfirmTrade;
