import clsx from 'clsx';
import React, { CSSProperties } from 'react';
import styles from './container.module.scss';

export type ComponentProps = {
  display?: 'outer' | 'inner';
  component?: React.ElementType;
  className?: string;
  style?: CSSProperties;
};

export const Container: React.FC<ComponentProps> = ({
  children,
  style,
  display = 'outer',
  component = 'div',
  className: classNameFromProps,
}) => {
  const className = clsx(styles.root, styles[display], classNameFromProps);

  return React.createElement(component, { style, className }, children);
};
