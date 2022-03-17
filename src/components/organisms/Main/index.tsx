import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import { Button } from 'src/components/molecules/Button';
import { ExpiresIn } from 'src/components/molecules/ExpiresIn';
import { Header } from 'src/components/molecules/Header';
import { ShareModal } from 'src/components/molecules/ShareModal';
import { TakerAdress } from 'src/components/molecules/TakerAdress';
import { TokenInput } from 'src/components/molecules/TokenInput';
import { TradeStatus } from 'src/components/molecules/TradeStatus';
import styles from './main.module.scss';

const DEFAULT_TOKEN = {
  symbol: 'SOL',
  address: '11111111111111111111111111111111',
  URI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
};

export type ValueType = {
  symbol: string;
  address: string;
  URI: string;
};

export type MainProps = {
  createOrder: (
    recipientAddress: String,
    baseMintStr: String,
    quoteMintStr: String,
    baseAmount: number,
    quoteAmount: number,
    startDate: number,
    endDate: number
  ) => void;
};

export const Main: React.FC<MainProps> = ({ createOrder }) => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [youPayValue, setYouPayValue] = useState<ValueType>(DEFAULT_TOKEN);
  const [youBuyValue, setYouBuyValue] = useState<ValueType>(DEFAULT_TOKEN);

  const [payAmount, setPayAmount] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');

  const [takerAddress, setTakerAddress] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  const wallet = useWallet();

  const clickHandler = () => {
    console.log('pay - ', parseFloat(payAmount));
    console.log('pay(adress) - ', youPayValue.address);
    console.log('buy - ', parseFloat(buyAmount));
    console.log('buy(adress) - ', youBuyValue.address);
    console.log('takerAddress - ', takerAddress);
    console.log('timestamp - ', timestamp);

    // console.log(Date.now());

    createOrder(
      takerAddress,
      youPayValue.address,
      youBuyValue.address,
      parseFloat(payAmount),
      parseFloat(buyAmount),
      Date.now(),
      parseInt(timestamp)
    );
  };

  return (
    <>
      {/* <ShareModal type="submitted" /> */}
      <div className={styles.root__wrapper}>
        <div className={styles.root__content}>
          <Typography
            color="paragraph"
            preset="title1"
            className={styles.root__title}
          >
            P2P Swap
          </Typography>
          <TokenInput
            title="You pay"
            value={payAmount}
            setValue={setPayAmount}
            balance={0.5}
            setActiveToken={setYouPayValue}
            token={youPayValue}
          />
          <img className={styles.root__swap} src="/images/swap.svg" />
          <TokenInput
            title="You buy"
            value={buyAmount}
            setValue={setBuyAmount}
            balance={0}
            setActiveToken={setYouBuyValue}
            token={youBuyValue}
          />
          {/* <TradeStatus firstToken="Solana" secondToken="Solana" ratio={0.228} /> */}
          <div className={styles.root__info}>
            <TakerAdress
              setInputValue={setTakerAddress}
              inputValue={takerAddress}
            />
            <ExpiresIn setInputValue={setTimestamp} inputValue={timestamp} />
          </div>
          <Button
            text="Create order"
            // isActive={wallet.connected}
            isActive={true}
            onClick={() => clickHandler()}
          />
        </div>
      </div>
    </>
  );
};
