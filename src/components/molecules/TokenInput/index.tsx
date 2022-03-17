import clsx from 'clsx';
import { Dispatch, SetStateAction, useState } from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './token-input.module.scss';
import tokens from 'src/mocks/tokens_new.json';
import { ValueType } from 'src/components/organisms/Main';

export type ModalTokenInputProps = {
  tokenList?: any;
  active?: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  setActiveToken: Dispatch<SetStateAction<ValueType>>;
};

export const TokenInputModal: React.FC<ModalTokenInputProps> = ({
  tokenList,
  active,
  setActive,
  setActiveToken,
}) => {
  return (
    <div className={clsx(styles.modal__wrapper, active && styles.active)}>
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <Typography preset="common2" color="paragraph">
            Select token
          </Typography>
          <img
            src="/images/cross.svg"
            onClick={() => setActive(false)}
            className={styles.modal__close}
          />
        </div>

        {/* <input
          className={styles.modal__search}
          placeholder="Search name or paste address"
        /> */}
        {/* TODO: ADD SEARCH FUNCTIONALITY */}
        <div className={styles.modal__overflow}>
          {tokens.map((item, index) => {
            const adress = item.address;
            const name = item.symbol;
            const URI = item.imgURI;
            return (
              <button
                key={index}
                className={styles.modal__item}
                value={item.address}
                onClick={(e: any) => {
                  setActiveToken({
                    symbol: item.symbol,
                    address: item.address,
                    URI: item.imgURI,
                  });
                  setActive(false);
                }}
              >
                <img src={item.imgURI} width="28" height="28" />
                <div className={styles.modal__item__info}>
                  <Typography preset="common2" color="paragraph" align="left">
                    {item.symbol}
                  </Typography>
                  <Typography preset="common1" color="inactive" align="left">
                    {item.name}
                  </Typography>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type TokenType = {
  name: string;
  icon: any; //TODO: FIX TYPE
};

export type TokenInputProps = {
  title: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  balance: number;
  setActiveToken: Dispatch<SetStateAction<ValueType>>;
  token: ValueType;
};

export const TokenInput: React.FC<TokenInputProps> = ({
  title,
  value,
  setValue,
  balance,
  setActiveToken,
  token,
}) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);

  return (
    <>
      <TokenInputModal
        active={isModalActive}
        setActive={setIsModalActive}
        setActiveToken={setActiveToken}
      />
      <div className={styles.root}>
        <div className={styles.root__left}>
          <Typography color="paragraph" preset="common1">
            {title}
          </Typography>
          <input
            className={styles.root__input}
            placeholder="0"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          ></input>
          <Typography color="paragraph" preset="common1">
            Balance: {balance}
          </Typography>
        </div>
        <div className={styles.root__right}>
          <button
            className={styles.root__token}
            onClick={() => setIsModalActive(true)}
          >
            <img
              src={token.URI}
              width="26"
              height="26"
              className={styles.root__token__image}
            />
            <Typography
              preset="common1"
              color="paragraph"
              className={styles.root__token__text}
            >
              {token.symbol}
            </Typography>
            <img className={styles.root__dropdown} src="/images/expand.svg" />
          </button>
        </div>
      </div>
    </>
  );
};
