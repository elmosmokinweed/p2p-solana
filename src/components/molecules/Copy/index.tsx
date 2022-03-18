import clsx from 'clsx';
import React from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './copy.module.scss';

export type CopyProps = {
  url?: string;
  isActive?: boolean;
};

export const Copy: React.FC<CopyProps> = ({
  url = 'https://kek.com/134r1f34',
  isActive = true,
}) => {
  const clickHandler = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className={clsx(styles.root, isActive && styles.active)}>
      <Typography color="paragraph" preset="common2">
        Link to order:
      </Typography>
      <div className={styles.root__copy}>
        <Typography
          color="paragraph"
          preset="common2"
          className={styles.root__copy__url}
        >
          {url}
        </Typography>
        <img src="/images/copy.svg" onClick={() => clickHandler()} />
      </div>
    </div>
  );
};
