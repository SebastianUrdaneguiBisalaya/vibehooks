'use client';

import { motion, useInView } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/cn';

type TextStaggeredFadeProps = {
  className?: string;
  text: string;
};

export default function StaggeredFade ({
  className = '',
  text,
}: TextStaggeredFadeProps) {
  const variants = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.06 },
      y: 0,
    }),
  };

  const letters = text.split('');
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.h2
      animate={isInView ? 'show' : ''}
      className={cn(
        'font-sora text-sm max-w-sm text-center self-center text-white',
        className
      )}
      initial="hidden"
      ref={ref}
      variants={variants}
      viewport={{ once: true }}
    >
      {letters.map((word, i) => (
        <motion.span custom={i} key={`${word}-${i}`} variants={variants}>
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};
