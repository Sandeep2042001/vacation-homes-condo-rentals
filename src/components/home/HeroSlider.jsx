import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  { src: 'https://videos.pexels.com/video-files/855771/855771-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
  { src: 'https://videos.pexels.com/video-files/4782853/4782853-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
  { src: 'https://videos.pexels.com/video-files/2882598/2882598-hd_1920_1080_24fps.mp4', type: 'video/mp4' },
  { src: 'https://videos.pexels.com/video-files/7516544/7516544-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
  { src: 'https://videos.pexels.com/video-files/5495843/5495843-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const HeroSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([(page + newDirection + videos.length) % videos.length, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 7000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.video
          key={page}
          src={videos[page].src}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition-colors ${page === i ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;