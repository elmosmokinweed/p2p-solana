import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useMemo } from 'react';
import { Main } from 'src/components/organisms/Main';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { ConfirmOptions, PublicKey } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import { addSyntheticTrailingComment } from 'typescript';
import idl from 'src/mocks/p2swap.json';

require('@solana/wallet-adapter-react-ui/styles.css');

const Home: NextPage = () => {
  const options: ConfirmOptions = { preflightCommitment: 'confirmed' };

  let provider: Provider;
  let program: Program;
  // let idl;

  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (publicKey && anchorWallet && connection) {
      provider = new Provider(connection, anchorWallet, options);
      // const programId = new PublicKey(idl.metadata.address);
      const programId = new PublicKey(
        'p2sSQ51hNP1yiQKtZ81sDzWBM6tkaS2ZtMrgnbBhE4v'
      );

      // Program.fetchIdl(programId, provider).then((idl) => {
      //   console.log(idl);
      // });
      program = new Program(idl as any, programId, provider);
      console.log(program);

      // program = new Program(idl, programId, provider);
      // console.log(connection);
      // console.log(provider);
      // program.rpc.createOrder();
    }
  }, [publicKey, anchorWallet, connection]);

  const clickHandler = () => {
    // const baseValue = document.getElementById('baseAmount');
    // console.log(baseValue);
  };

  return (
    <>
      <Head>
        <title>p2p solana</title>
      </Head>
      <WalletMultiButton />
      <WalletDisconnectButton />
      {/* <Main /> */}
      <div style={{ display: 'flex', flexFlow: 'column', width: '400px' }}>
        <input id="baseAmount" placeholder="baseAmount"></input>
        <input id="quoteAmount" placeholder="quoteAmount"></input>
        <input id="baseMint" placeholder="baseMint"></input>
        <input id="quoteMint" placeholder="quoteMint"></input>
        <input id="receiverAddress" placeholder="receiverAddress"></input>
        <input id="expiresIn" placeholder="expiresIn"></input>
        <button onClick={() => clickHandler()}>send swap</button>
      </div>
    </>
  );
};

export default Home;
//2 textarea
//baseAmount
//quoteAmount
//2 strings(?)
//baseMint
//quoteMint
//
//recieverAdress - string;
//expiresIn - unix ts;
