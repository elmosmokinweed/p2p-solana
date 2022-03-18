import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
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
import { Header } from 'src/components/molecules/Header';
import { Container } from 'src/components/templates/Container';
import { Main } from 'src/components/organisms/Main';
import { useRouter } from 'next/router';

require('@solana/wallet-adapter-react-ui/styles.css');

const Home: NextPage = () => {
  const [shareUrl, setShareUrl] = useState('');
  const [isUrlVisible, setIsUrlVisible] = useState(false);
  const options: ConfirmOptions = { preflightCommitment: 'confirmed' };

  const programId = new PublicKey(
    'p2sSQ51hNP1yiQKtZ81sDzWBM6tkaS2ZtMrgnbBhE4v'
  );
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  let provider: Provider | null = null;
  let program: Program | null = null;

  useEffect(() => {
    if (publicKey && anchorWallet && connection) {
      provider = new Provider(connection, anchorWallet, options);
      //@ts-ignore
      program = new Program(idl, programId, provider);
      console.log(
        program.account.order.fetch(
          '9ANt26vpv8S4Lxa1B8ua9rCPEfuZTapJzG25MjjiGxrL'
        )
      );

      // CancelOrder instruction wrapper
      const cancelOrder = async (orderStr: String) => {
        const order = new PublicKey(orderStr);

        const funder = anchorWallet.publicKey;
        const [escrow, escrowBump] = await PublicKey.findProgramAddress(
          [
            Buffer.from('p2s_order_escrow'),
            funder.toBuffer(),
            order.toBuffer(),
          ],
          programId
        );
        const tokenProgram = TOKEN_PROGRAM_ID;
        const systemProgram = SystemProgram.programId;

        const orderAcc = await connection.getAccountInfo(order);
        const baseMintEncoded = orderAcc?.data.slice(25, 25 + 32);
        const baseMint = new PublicKey(bs58.encode(baseMintEncoded!));

        let funderTokenAccount = funder;
        if (baseMint.toBase58() != SystemProgram.programId.toBase58()) {
          let associatedAccount = await getAssociatedTokenAddress(
            baseMint,
            anchorWallet.publicKey
          );

          try {
            getAccount(connection, associatedAccount);
            funderTokenAccount = associatedAccount;
          } catch {
            // TODO: Show error for insufficient balance and reject
            console.log(
              `Base associated token account(${associatedAccount})not found / zero balance`
            );
            return;
          }
        }

        // TODO: Add catch here to check if user reject transaction
        const tx = await program.rpc.cancelOrder(new BN(escrowBump), {
          accounts: {
            order: order,
            funder: funder,
            funderTokenAccount: funderTokenAccount,
            escrow: escrow,
            tokenProgram: tokenProgram,
            systemProgram: systemProgram,
          },
          signers: [],
        });

        console.log(`cancelOrder tx: ${tx}`);
      };

      // ExecuteOrder instruction wrapper
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

        const recipient = anchorWallet.publicKey;
        const [escrow, escrowBump] = await PublicKey.findProgramAddress(
          [
            Buffer.from('p2s_order_escrow'),
            funder.toBuffer(),
            order.toBuffer(),
          ],
          programId
        );
        const clockSysvar = SYSVAR_CLOCK_PUBKEY;
        const tokenProgram = TOKEN_PROGRAM_ID;
        const systemProgram = SystemProgram.programId;

        let recipientTokenAccount = recipient;
        if (quoteMint.toBase58() != SystemProgram.programId.toBase58()) {
          let associatedAccount = await getAssociatedTokenAddress(
            quoteMint,
            anchorWallet.publicKey
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
            anchorWallet.publicKey
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
        const tx = await program.rpc.executeOrder(new BN(escrowBump), {
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

        console.log(`executeOrder tx: ${tx}`);
      };

      // executeOrder('C3QL7uy4ZBvSoAPrCf2HMJpMteza67Qod6tuFvebPJDR');
      // cancelOrder('7UbujkDCBeJFzqm4DWCELK6CRWf3XAkncnyiUywxLTC8');
      // createOrder(
      //   'FSha5JkxgfTCaNxRnEvvWdRrnWbYWgHfeiPcW97ghJgz',
      //   '11111111111111111111111111111111',
      //   '11111111111111111111111111111111',
      //   0.5,
      //   0.5,
      //   0,
      //   1647550246
      // );
    }
  });

  // CreateOrder instruction wrapper
  const createOrder = async (
    recipientAddress: String,
    baseMintStr: String,
    quoteMintStr: String,
    baseAmount: number,
    quoteAmount: number,
    startDate: number,
    endDate: number
  ) => {
    const escrowMint = new PublicKey(baseMintStr);
    const quoteMint = new PublicKey(quoteMintStr);

    if (provider && program && anchorWallet) {
      let baseDecimals =
        escrowMint.toBase58() == SystemProgram.programId.toBase58()
          ? 9
          : (await getMint(connection, escrowMint)).decimals;

      let quoteDecimals =
        quoteMint.toBase58() == SystemProgram.programId.toBase58()
          ? 9
          : (await getMint(connection, quoteMint)).decimals;

      let funderTokenAccount = anchorWallet.publicKey;
      if (escrowMint.toBase58() != SystemProgram.programId.toBase58()) {
        let associatedAccount = await getAssociatedTokenAddress(
          escrowMint,
          anchorWallet.publicKey
        );

        try {
          getAccount(connection, associatedAccount);
          funderTokenAccount = associatedAccount;
        } catch {
          // TODO: Show error for insufficient balance and reject
          console.log(
            `Base associated token account(${associatedAccount})not found / zero balance`
          );
          return;
        }
      }

      let quoteTokenAccount = anchorWallet.publicKey;
      if (quoteMint.toBase58() != SystemProgram.programId.toBase58()) {
        let associatedAccount = await getAssociatedTokenAddress(
          quoteMint,
          anchorWallet.publicKey
        );

        try {
          getAccount(connection, associatedAccount);
          quoteTokenAccount = associatedAccount;
        } catch {
          // TODO: Show error for insufficient balance and reject
          console.log(
            `Quote associated token account(${associatedAccount})not found / zero balance`
          );
          return;
        }
      }

      const order = Keypair.generate();
      const funder = anchorWallet.publicKey;
      const recipient = new PublicKey(recipientAddress);
      const [escrow, escrowBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from('p2s_order_escrow'),
          funder.toBuffer(),
          order.publicKey.toBuffer(),
        ],
        programId
      );
      const rentSysvar = SYSVAR_RENT_PUBKEY;
      const clockSysvar = SYSVAR_CLOCK_PUBKEY;
      const tokenProgram = TOKEN_PROGRAM_ID;
      const systemProgram = SystemProgram.programId;

      // TODO: Add catch here to check if user reject transaction
      try {
        const tx = await program.rpc.createOrder(
          new BN(escrowBump),
          new BN(baseAmount * Math.pow(10, baseDecimals)),
          new BN(quoteAmount * Math.pow(10, quoteDecimals)),
          null,
          new BN(endDate),
          {
            accounts: {
              order: order.publicKey,
              funder: funder,
              recipient: recipient,
              funderTokenAccount: funderTokenAccount,
              escrow: escrow,
              quoteTokenAccount: quoteTokenAccount,
              escrowMint: escrowMint,
              quoteMint: quoteMint,
              rentSysvar: rentSysvar,
              clockSysvar: clockSysvar,
              tokenProgram: tokenProgram,
              systemProgram: systemProgram,
            },
            signers: [order],
          }
        );
        console.log(`createOrder tx: ${tx}`);
        console.log(`order: ${order.publicKey.toBase58()}`);
        setShareUrl(`${window.location.href}${order.publicKey.toBase58()}`);
        setIsUrlVisible(true);
        // alert(
        //   `Order has been created!\nURL: ${
        //     process.env.PUBLIC_URL
        //   }/${order.publicKey.toBase58()}`
        // );
      } catch (e) {
        console.log(e);
        throw new Error(`createOrder error`);
      }
      return order.publicKey;
    } else {
      // console.log(publicKey);
      // console.log(anchorWallet);
      // console.log(connection);
      throw new Error('not valid smth in if');
    }
  };

  return (
    <>
      <Head>
        <title>BIDDI</title>
      </Head>
      <Header isConnected={true} />
      <Container>
        <Main
          createOrder={createOrder}
          url={shareUrl}
          isUrlVisible={isUrlVisible}
        />
      </Container>
    </>
  );
};

export default Home;
