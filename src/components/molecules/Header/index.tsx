import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styles from './header.module.scss';

export type HeaderProps = {
  isConnected?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isConnected = false }) => {
  return (
    <header className={styles.root}>
      <div className={styles.root__logo}>
        <img src="/images/logo.svg" />
      </div>
      <div className={styles.root__buttons}>
        <WalletMultiButton className={styles.root__buttons__multi} />
        {isConnected && (
          <WalletDisconnectButton
            className={styles.root__buttons__disconnect}
          />
        )}
      </div>
    </header>
  );
};
