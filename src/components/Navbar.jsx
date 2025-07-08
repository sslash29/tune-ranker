import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import TopRanking from "./TopRanking";
function Navbar({
  isAlbumSelected,
  setAlbumData,
  setActiveSection,
  isAccountSelected,
}) {
  return (
    <nav className="text-white p-5 px-10 flex justify-between items-center">
      <Logo
        isAlbumSelected={isAlbumSelected}
        setActiveSection={setActiveSection}
        isAccountSelected={isAccountSelected}
      />
      <SearchBar
        isAlbumSelected={isAlbumSelected}
        setAlbumData={setAlbumData}
        setActiveSection={setActiveSection}
        isAccountSelected={isAccountSelected}
      />
      <div className="flex gap-3.5">
        <TopRanking
          isAlbumSelected={isAlbumSelected}
          setAlbumData={setAlbumData}
          setActiveSection={setActiveSection}
        />
        {/* <Diary /> */}
        <UserProfile />
      </div>
    </nav>
  );
}

export default Navbar;
