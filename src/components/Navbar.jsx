import { useNavigate } from "react-router-dom";
import FilterAlbums from "./FilterAlbums";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";

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
    <nav className="bg-[#191919] text-white">
      <Logo isAlbumSelected={isAlbumSelected} />
      <SearchBar
        isAlbumSelected={isAlbumSelected}
        setAlbumData={setAlbumData}
      />
      <FilterAlbums
        setAlbumsMainPage={setAlbumsMainPage}
        albumsMainPage={albumsMainPage}
      />
      <p className="pointer" onClick={() => handleTopAlbumsClick()}>
        Top Ranking
      </p>
      <UserProfile />
    </nav>
  );
}

export default Navbar;
