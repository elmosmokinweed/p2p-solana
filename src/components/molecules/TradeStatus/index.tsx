import React, { useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './trade-status.module.scss';

export type TradeStatusProps = {
  firstToken: string;
  secondToken: string;
  ratio: number;
};

export type ActionButtonProps = {
  text: string;
  action: () => void;
};

export const ActionButton: React.FC<ActionButtonProps> = ({ text, action }) => {
  return (
    <button className={styles.root__button} onClick={() => action()}>
      <Typography preset="common1" color="paragraph">
        {text}
      </Typography>
    </button>
  );
};

export const TradeStatus: React.FC<TradeStatusProps> = ({
  firstToken,
  secondToken,
  ratio,
}) => {
  const [statusValue, setStatusValue] = useState('');

  return (
    <div className={styles.root}>
      <Typography color="paragraph" preset="common1">
        {firstToken} per {secondToken}
      </Typography>
      <div className={styles.root__controls}>
        <ActionButton text="-1%" action={() => console.log('-1')} />
        <input
          className={styles.root__input}
          placeholder="ABD..."
          onChange={(e) => setStatusValue(e.target.value)}
          value={statusValue}
        ></input>
        <ActionButton text="+1%" action={() => console.log('+1')} />
      </div>
      <button>
        <Typography preset="common1" color="subtitle">
          Set to market
        </Typography>
      </button>
    </div>
  );
};
