import { useNavigate } from "react-router-dom";
import FilterAlbums from "./FilterAlbums";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { motion } from "motion/react";
import Diary from "./Diary";

function Navbar({
  isAlbumSelected,
  setAlbumData,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const navigate = useNavigate();

  const handleTopAlbumsClick = function () {
    navigate("/top100");
  };
  return (
    <nav className="bg-[#191919] text-white p-5 px-10 flex justify-between items-center">
      <Logo isAlbumSelected={isAlbumSelected} />
      <SearchBar
        isAlbumSelected={isAlbumSelected}
        setAlbumData={setAlbumData}
      />
      <div className="flex gap-3.5">
        <motion.p
          className="bg-[#2A2A2A] p-3 py-2 rounded-3xl px-5 cursor-pointer"
          onClick={() => handleTopAlbumsClick()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Top Ranking
        </motion.p>
        <Diary />
        <UserProfile />
      </div>
    </nav>
  );
}

export default Navbar;
