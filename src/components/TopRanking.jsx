import { motion } from "motion/react";
import { useState } from "react";

function TopRanking({ setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <motion.p
          className="bg-[#2A2A2A] p-3 py-2 rounded-3xl px-5 cursor-pointer"
          onClick={() => setIsOpen((open) => !open)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Top Ranking
        </motion.p>
      </div>
      {isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="scale-110 absolute bg-[#2a2a2a] p-3 cursor-pointer translate-y-4 translate-x-5 opacity-90 rounded-2xl z-100"
        >
          <p
            className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded cursor-pointer `}
            onClick={() => setActiveSection("albums")}
          >
            Albums
          </p>
          <p
            className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded cursor-pointer `}
            onClick={() => setActiveSection("songs")}
          >
            Songs
          </p>
          <p
            className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded `}
            onClick={() => setActiveSection("artists")}
          >
            Artists
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default TopRanking;
