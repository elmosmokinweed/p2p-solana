import { useEffect, useRef } from 'react';

export enum Breakpoint {
  UNKNOWN = 0,
  MOBILE = 320,
  TABLET = 768,
  DESKTOP = 1300,
}

export const useBreakpoints = (
  callback: (breakpoint: Breakpoint) => void
): void => {
  const breakpointRef = useRef<Breakpoint>(Breakpoint.UNKNOWN);

  useEffect(() => {
    const breakpointsOrder = [
      Breakpoint.MOBILE,
      Breakpoint.TABLET,
      Breakpoint.DESKTOP,
    ];

    const listener = () => {
      const windowWidth = window.innerWidth;
      let breakpoint = Breakpoint.UNKNOWN;

      for (let i = 0; i < breakpointsOrder.length; i++) {
        if (windowWidth >= breakpointsOrder[i]) {
          breakpoint = breakpointsOrder[i];
        }
      }

      if (breakpointRef.current !== breakpoint) {
        breakpointRef.current = breakpoint;

        callback(breakpoint);
      }
    };

    listener();

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);
  
};
