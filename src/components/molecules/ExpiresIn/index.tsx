import React, { Dispatch, useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './expires-in.module.scss';

export type ExpiresInProps = {
  inputValue: string;
  setInputValue: Dispatch<React.SetStateAction<string>>;
};

export const ExpiresIn: React.FC<ExpiresInProps> = ({
  inputValue,
  setInputValue,
}) => {
  // const [expiresInValue, setExpiresInValue] = useState<string>('');

  return (
    <div className={styles.root}>
      <Typography preset="common1" color="paragraph">
        Expires in
      </Typography>
      <input
        className={styles.root__input}
        placeholder="timestamp"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      ></input>
    </div>
  );
};
