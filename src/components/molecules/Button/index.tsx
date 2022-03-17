import clsx from 'clsx';
import React from 'react';
import { Typography } from 'src/components/atoms/Typography';
import styles from './button.module.scss';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick = () => {
    console.log('clicked');
  },
  isActive = false,
}) => {
  return (
    <button
      className={clsx(styles.root, isActive && styles.active)}
      onClick={onClick}
      disabled={!isActive}
    >
      <Typography color="paragraph" preset="common1">
        {text}
      </Typography>
    </button>
  );
};
