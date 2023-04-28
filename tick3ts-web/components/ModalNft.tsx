import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  animate,
  MotionValue,
  AnimationControls,
} from 'framer-motion';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface BiggerCardProps {
  id: string;
  url: string;
  onClick: Dispatch<SetStateAction<string>>
}

export default function BiggerCard({ id, url, onClick }: BiggerCardProps) {
  const popdown = () => onClick('');
  const x: MotionValue<number> = useMotionValue(200);
  const y: MotionValue<number> = useMotionValue(200);
  const controls: AnimationControls = useAnimation();

  const rotateX = useTransform(y, [0, 400], [45, -45]);
  const rotateY = useTransform(x, [0, 400], [-45, 45]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();

    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const spin = {
    rotate: 360,
    transition: {
      duration: 0.5,
      loop: Infinity,
      ease: 'easeInOut',
    },
  };

  useEffect(() => {
    controls.start(spin);
  }, []);

  return (
    <motion.div
      style={{
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
      }}
    >
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#535353',
        }}
        onClick={popdown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, filter: 'blur(30px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={() => {
          animate(x, 200);
          animate(y, 200);
        }}
        style={{
          zIndex: 1,
          position: 'absolute',
          willChange: 'opacity',
          top: '0',
          left: '0',
          marginTop: -160,
          marginLeft: -125,
          width: 250,
          height: 400,
          borderRadius: 30,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        animate={controls}
        layoutId={'card' + id}
      />
    </motion.div>
  );
}
