
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  "https://res.cloudinary.com/dbxvk3apv/video/upload/v1718885559/production_id_4779866_1080p_j8wz9t.mp4",
  "https://res.cloudinary.com/dbxvk3apv/video/upload/v1718885558/pexels-roman-odintsov-8134311_1080p_j2rmd9.mp4",
  "https://res.cloudinary.com/dbxvk3apv/video/upload/v1718885558/pexels-roman-odintsov-8134311_1080p_j2rmd9.mp4",
  "https://res.cloudinary.com/dbxvk3apv/video/upload/v1718885557/pexels-kindel-media-8412312_1080p_z11wob.mp4",
  "https://res.cloudinary.com/dbxvk3apv/video/upload/v1718885556/pexels-rostislav-uzunov-9150545_2160p_j9qjaj.mp4"
];

const HeroVideoSlider = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <AnimatePresence>
        <motion.video
          key={currentVideoIndex}
          src={videos[currentVideoIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </AnimatePresence>
      <div className="video-overlay"></div>
    </div>
  );
};

export default HeroVideoSlider;
