import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import { Header } from 'src/components/molecules/Header';
import { Container } from 'src/components/templates/Container';
import { TradeConfirmation } from 'src/components/organisms/TradeConfirmation';

require('@solana/wallet-adapter-react-ui/styles.css');

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  ConfirmOptions,
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';
import { Program, Provider, BN } from '@project-serum/anchor';
import idl from 'src/mocks/p2swap.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

export type ContentType = {
  buyAmount: number;
  sellAmount: number;
  buySymbol: string;
  sellSymbol: string;
  expirationDate: number;
  senderAddress: string;
};

const MOCK = {
  buyAmount: 2.234,
  sellAmount: 3.123,
  buySymbol: 'SOL',
  sellSymbol: 'SOL',
  expirationDate: 134123412341111,
  senderAddress: '31f183hf0928h03f982hv92hf9',
};

let provider: Provider | null;
let program: Program | null;

const ConfirmTrade: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [content, setContent] = useState<ContentType | null>(null);

  const router = useRouter();
  let address = router.asPath.substring(1);
  console.log(address);

  const options: ConfirmOptions = { preflightCommitment: 'confirmed' };

  const programId = new PublicKey(
    'p2sSQ51hNP1yiQKtZ81sDzWBM6tkaS2ZtMrgnbBhE4v'
  );
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (publicKey && anchorWallet && connection) {
      provider = new Provider(connection, anchorWallet, options);
      //@ts-ignore
      program = new Program(idl, programId, provider);
      console.log(program);
      try {
        program.account.order
          .fetch(address)
          .then(async (content) => {
            const buy =
              content.quoteMint.toBase58() == SystemProgram.programId.toBase58()
                ? 9
                : (await getMint(connection, content.quoteMint)).decimals;

            const sell =
              content.baseMint.toBase58() == SystemProgram.programId.toBase58()
                ? 9
                : (await getMint(connection, content.baseMint)).decimals;

            setContent({
              buyAmount: content.quoteAmount.toNumber() / Math.pow(10, buy),
              sellAmount: content.baseAmount.toNumber() / Math.pow(10, sell),
              buySymbol: 'SOL',
              sellSymbol: 'SOL',
              expirationDate: content.expireDate.toNumber(),
              senderAddress: content.funder.toBase58(),
            });
            setIsLoaded(true);

            if (Object.keys(content.status)[0] !== 'created') {
              alert('Order is already executed!');
              router.push('/');
            }
          })
          .catch(() => router.push('/'));
      } catch (e) {
        router.push('/');
      }
    }
  }, [publicKey, anchorWallet, connection, program]);

  const executeOrder = async (orderStr: String) => {
    const order = new PublicKey(orderStr);
    const orderAcc = await connection.getAccountInfo(order);
    const baseMint = new PublicKey(
      bs58.encode(orderAcc?.data.slice(25, 25 + 32)!)
    );
    const quoteMint = new PublicKey(
      bs58.encode(orderAcc?.data.slice(57, 57 + 32)!)
    );
    const funder = new PublicKey(
      bs58.encode(orderAcc?.data.slice(89, 89 + 32)!)
    );
    const quoteTokenAccount = new PublicKey(
      bs58.encode(orderAcc?.data.slice(185, 185 + 32)!)
    );

    const recipient = anchorWallet!.publicKey;
    const [escrow, escrowBump] = await PublicKey.findProgramAddress(
      [Buffer.from('p2s_order_escrow'), funder.toBuffer(), order.toBuffer()],
      programId
    );
    const clockSysvar = SYSVAR_CLOCK_PUBKEY;
    const tokenProgram = TOKEN_PROGRAM_ID;
    const systemProgram = SystemProgram.programId;

    let recipientTokenAccount = recipient;
    if (quoteMint.toBase58() != SystemProgram.programId.toBase58()) {
      let associatedAccount = await getAssociatedTokenAddress(
        quoteMint,
        anchorWallet!.publicKey
      );

      try {
        getAccount(connection, associatedAccount);
        recipientTokenAccount = associatedAccount;
      } catch {
        // TODO: Show error for insufficient balance and reject
        console.log(
          `Base associated token account(${associatedAccount})not found / zero balance`
        );
        return;
      }
    }

    let recipientReceiveTokenAccount = recipient;
    if (baseMint.toBase58() != SystemProgram.programId.toBase58()) {
      let associatedAccount = await getAssociatedTokenAddress(
        baseMint,
        anchorWallet!.publicKey
      );

      try {
        getAccount(connection, associatedAccount);
        recipientReceiveTokenAccount = associatedAccount;
      } catch {
        // TODO: Show error for insufficient balance and reject
        console.log(
          `Quote associated token account(${associatedAccount})not found / zero balance`
        );
        return;
      }
    }

    // TODO: Add catch here to check if user reject transaction
    const tx = await program!.rpc.executeOrder(new BN(escrowBump), {
      accounts: {
        order: order,
        funder: funder,
        recipient: recipient,
        recipientTokenAccount: recipientTokenAccount,
        recipientReceiveTokenAccount: recipientReceiveTokenAccount,
        escrow: escrow,
        quoteTokenAccount: quoteTokenAccount,
        clockSysvar: clockSysvar,
        tokenProgram: tokenProgram,
        systemProgram: systemProgram,
      },
      signers: [],
    });
    alert('Order completed successfully!');
    console.log(`executeOrder tx: ${tx}`);
  };

  const onClick = () => {
    if (!program) {
      console.log('no rpc');
    } else {
      executeOrder(address);
    }
    // console.log(content);
  };

  // CreateOrder instruction wrapper

  return (
    <>
      <Head>
        <title>Confirm swap</title>
      </Head>
      <Header isConnected={true} />
      <Container>
        <TradeConfirmation
          info={isLoaded ? content! : MOCK}
          executeHandler={onClick}
        />
      </Container>
    </>
  );
};

export default ConfirmTrade;
