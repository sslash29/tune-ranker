import { useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import { AnimatePresence, motion } from "motion/react";

function FilterAlbums({ setAlbumsMainPage, albumsMainPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("high");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    // Cleanup listener on unmount
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsOpen]);

  async function HighestRated() {
    // Create a new sorted array without mutating state directly
    const highestRated = [...albumsMainPage].sort(
      (a, b) => b.rating - a.rating
    );
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: highestRated })
      .eq("id", user.id);
    setIsActive("high");
    setIsOpen(false);
  }

  async function LowestRated() {
    // Create a new sorted array without mutating state directly
    const lowestRated = [...albumsMainPage].sort((a, b) => {
      console.log(a, b);
      return a.rating - b.rating;
    });

    setAlbumsMainPage(lowestRated);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: lowestRated })
      .eq("id", user.id);
    setIsActive("low");
    setIsOpen(false);
  }

  async function NewestAdded() {
    const newest = [...albumsMainPage].sort((a, b) => b.addedAt - a.addedAt);
    setAlbumsMainPage(newest);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: newest })
      .eq("id", user.id);
    setIsActive("new");
    setIsOpen(false);
  }

  async function OldestAdded() {
    const oldest = [...albumsMainPage].sort((a, b) => a.addedAt - b.addedAt);
    setAlbumsMainPage(oldest);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: oldest })
      .eq("id", user.id);
    setIsActive("old");
    setIsOpen(false);
  }

  return (
    <div className="bg-[#2A2A2A] w-fit flex items-center rounded-full p-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        <img src="Filter.svg" alt="filter" className="rounded-full" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute bg-[#2a2a2a] p-3 cursor-pointer translate-y-4 -translate-x-13 opacity-95"
          >
            <p
              className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded ${
                isActive === "high" ? "bg-[#3a3a3a] font-semibold" : ""
              }`}
              onClick={HighestRated}
            >
              Highest Rated
            </p>
            <p
              className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded ${
                isActive === "low" ? "bg-[#3a3a3a] font-semibold" : ""
              }`}
              onClick={LowestRated}
            >
              Lowest Rated
            </p>
            <p
              className={`hover:bg-[#3a3a3a] transition-all px-2 my-2 rounded ${
                isActive === "new" ? "bg-[#3a3a3a] font-semibold" : ""
              }`}
              onClick={NewestAdded}
            >
              Newest
            </p>
            <p
              className={`hover:bg-[#3a3a3a] transition-all px-2 my-3 rounded ${
                isActive === "old" ? "bg-[#3a3a3a] font-semibold" : ""
              }`}
              onClick={OldestAdded}
            >
              Oldest
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterAlbums;
