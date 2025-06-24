import { useNavigate } from "react-router-dom";
import FilterAlbums from "./FilterAlbums";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { motion } from "motion/react";

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
    <nav className="bg-[#191919] text-white p-5 flex justify-between items-center">
      <Logo isAlbumSelected={isAlbumSelected} />
      <SearchBar
        isAlbumSelected={isAlbumSelected}
        setAlbumData={setAlbumData}
      />
      <FilterAlbums
        setAlbumsMainPage={setAlbumsMainPage}
        albumsMainPage={albumsMainPage}
      />
      <motion.p
        className="bg-[#2A2A2A] p-3 rounded-3xl px-5 cursor-pointer"
        onClick={() => handleTopAlbumsClick()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Top Ranking
      </motion.p>
      <UserProfile />
    </nav>
  );
}

export default Navbar;
