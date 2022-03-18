import React, { Dispatch, useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './taker-adress.module.scss';

export type TakerAdressProps = {
  inputValue: string;
  setInputValue: Dispatch<React.SetStateAction<string>>;
};

export const TakerAdress: React.FC<TakerAdressProps> = ({
  inputValue,
  setInputValue,
}) => {
  // const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className={styles.root}>
      <Typography preset="common1" color="paragraph">
        Taker Adress
      </Typography>
      <input
        className={styles.root__input}
        placeholder="ABD..."
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      ></input>
    </div>
  );
};
