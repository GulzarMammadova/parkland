import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { letters } from "./data";

export function GallerySection() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [active]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openModal = (item) => {
    const img = new Image();
    img.src = item.image;
    setActive(item);
  };

  return (
    <>
      <div className="rl-gallery">
        {letters.map((item) => (
          <div key={item.id} className="rl-card">
            <motion.div layoutId={`card-${item.id}`} className="rl-image-wrapper">
              <img src={item.image} alt={item.title} />

              <div className="rl-overlay" onClick={() => openModal(item)}>
                <div className="rl-expand">↗</div>
              </div>
            </motion.div>

            <div className="rl-card-footer">
              <img src={item.logo} alt={item.title} />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="rl-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`card-${active.id}`}
              className="rl-modal-content"
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.image} alt="Preview" />

              <button className="rl-close" onClick={() => setActive(null)}>
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}