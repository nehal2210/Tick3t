import React, { useState } from 'react';
import {
  Text,
} from '@chakra-ui/react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  animate,
  MotionValue,
  AnimationControls
} from 'framer-motion';

interface CardProps {
  url: string;
  name: string;
  cardId: string;
  props?: any;
}

const Card = ({ url, name, cardId, ...props }: CardProps) => {
  const x: MotionValue<number> = useMotionValue(200);
  const y: MotionValue<number> = useMotionValue(200);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const controls: AnimationControls = useAnimation();

  const rotateX = useTransform(y, [0, 400], [45, -45]);
  const rotateY = useTransform(x, [0, 400], [-45, 45]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();

    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      layout
      layoutId={'card' + cardId}
      style={{
        width: 250,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        placeContent: 'center',
        borderRadius: 30,
        margin: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        perspective: 400,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        animate(x, 200, {
          duration: 2
        });
        animate(y, 200, {
          duration: 2
        });
      }}
      animate={controls}
      {...props}
    >
      <motion.div
        style={{
          width: 250,
          height: 250,
          borderRadius: 30,
          backgroundColor: 'red',
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          rotateX: rotateX,
          rotateY: rotateY
        }}
      />
      <Text fontSize="lg" fontWeight="semibold">
        {name}
      </Text>
    </motion.div>
  );
};

export default Card;
