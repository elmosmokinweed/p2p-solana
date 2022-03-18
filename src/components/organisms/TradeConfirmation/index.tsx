import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from 'src/components/atoms/Typography';
import { Button } from 'src/components/molecules/Button';
import { ContentType } from 'src/pages/[id]';
import { getFormattedTime } from 'src/utils/getFormattedTime';
import styles from './trade-confirmation.module.scss';

export type TradeConfirmationProps = {
  executeHandler: () => void;
  info: ContentType;
};

export const TradeConfirmation: React.FC<TradeConfirmationProps> = ({
  executeHandler,
  info,
}) => {
  const router = useRouter();

  const clickHandler = () => {
    router.push('/');
  };

  return (
    <div className={styles.root__wrapper}>
      <div className={styles.root}>
        <Typography
          color="paragraph"
          preset="title1"
          className={styles.root__title}
        >
          P2P Swap
        </Typography>
        <div className={styles.root__window}>
          <div className={styles.root__header}>
            <Typography preset="common2" color="paragraph">
              Confirm P2P order
            </Typography>
            <img
              src="/images/cross.svg"
              onClick={() => clickHandler()}
              className={styles.modal__close}
            />
          </div>
          <hr className={styles.root__line} />
          <div className={styles.root__info}>
            <div className={styles.root__info__left}>
              <Typography preset="common1" color="paragraph">
                You buy
              </Typography>
              <Typography
                preset="numbers"
                color="inactive"
                className={styles.root__elipsis}
              >
                {info.buyAmount}
              </Typography>
            </div>
            <div className={styles.root__info__right}>
              <Typography preset="common2" color="paragraph">
                {info.buySymbol}
              </Typography>
            </div>
          </div>
          <img
            src="images/arrow.svg"
            width="24"
            height="24"
            className={styles.root__arrow}
          />
          <div className={styles.root__info}>
            <div className={styles.root__info__left}>
              <Typography preset="common1" color="paragraph">
                You Sell
              </Typography>
              <Typography
                preset="numbers"
                color="inactive"
                className={styles.root__elipsis}
              >
                {info.sellAmount}
              </Typography>
            </div>
            <div className={styles.root__info__right}>
              <Typography preset="common2" color="paragraph">
                {info.sellSymbol}
              </Typography>
            </div>
          </div>
          <hr className={styles.root__line} />
          <div className={styles.root__payment}>
            <div className={styles.root__payment__line}>
              <Typography preset="common1" color="paragraph">
                Expiration
              </Typography>
              <Typography preset="common1" color="paragraph">
                {getFormattedTime(info.expirationDate)}
              </Typography>
            </div>
            <div className={styles.root__payment__line}>
              <Typography preset="common1" color="paragraph">
                Sender Address
              </Typography>
              <Typography
                preset="common1"
                color="inactive"
                className={styles.root__elipsis}
              >
                {info.senderAddress}
              </Typography>
            </div>
            {/* <div className={styles.root__payment__line}>
              <Typography preset="common1" color="paragraph">
                Gas price
              </Typography>
              <Typography preset="common1" color="paragraph">
                0.000005
              </Typography>
            </div> */}
          </div>
          <Button
            text="Confirm order"
            isActive={true}
            onClick={executeHandler}
          />
        </div>
      </div>
    </div>
  );
};
