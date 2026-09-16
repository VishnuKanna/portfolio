import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hero } from '../data/portfolio';

const DURATION = 3400;

export default function RotatingText() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % hero.identities.length), DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[1.5em] overflow-hidden" aria-live="off">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg font-medium text-cream-soft sm:text-xl"
        >
          {hero.identities[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}