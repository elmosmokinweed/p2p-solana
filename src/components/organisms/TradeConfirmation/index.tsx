import React from 'react';
import styles from './trade-confirmation.module.scss';

export type TradeConfirmationProps = {};

export const TradeConfirmation: React.FC<TradeConfirmationProps> = () => {
  return <div className={styles.root}>TradeConfirmation</div>;
};
