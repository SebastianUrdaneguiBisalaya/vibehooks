'use client';

import { motion, useInView } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/cn';

export default function BlurIn({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : {}}
      className={cn(className)}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      ref={ref}
      transition={{ duration: 2.5 }}
    >
      {children}
    </motion.div>
  );
};
