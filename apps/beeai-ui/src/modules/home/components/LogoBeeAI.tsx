import { useState } from 'react';
import Lottie from 'lottie-react';
import clsx from 'clsx';
import Logo from './LogoBeeAI.svg';
import animationData from './LogoBeeAI.json';
import classes from './LogoBeeAI.module.scss';

const LogoBeeAI = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx(classes.container, { [classes.loaded]: loaded })}>
      <Logo className={classes.placeholder} />
      <Lottie
        className={classes.animation}
        animationData={animationData}
        loop={false}
        onDOMLoaded={() => {
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default LogoBeeAI;
