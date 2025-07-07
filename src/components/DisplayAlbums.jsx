// DispalyAlbums.jsx → DisplayAlbums.jsx
import FavoriteAlbums from "./FavoriteAlbums";
import { AnimatePresence, motion } from "motion/react";
import RecentActivity from "./RecentActivity";

function DisplayAlbums({ display }) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {display === "favorite-albums" ? (
          <motion.div
            key="favorites"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          >
            <FavoriteAlbums editMode={false} />
          </motion.div>
        ) : (
          <motion.div
            key="recent"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          >
            <RecentActivity />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DisplayAlbums;
