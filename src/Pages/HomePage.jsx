import { useContext, useEffect, useState } from "react";
import Album from "../components/Album";
import AlbumsMainPage from "../components/AlbumsMainPage";
import FilterAlbums from "../components/FilterAlbums";
import capitalizeWords from "../helpers/capatalize";
import TopSongs from "./TopSongs";
import { UserContext } from "../context/UserContext";
import Album100 from "../components/Album100";
import Account from "./UserAccount";

function HomePage({
  isAlbumSelected,
  accountSelected,
  setAlbumData,
  albumSelected,
  albumData,
  setAlbumsMainPage,
  albumsMainPage,
  activeSection,
  setActiveSection,
}) {
  const [isShowRating, setIsShowRating] = useState(false);
  const [albumsPosition, setAlbumsPosition] = useState([]);

  const { top100, user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (top100 && Object.keys(top100).length > 0) {
      setAlbumsPosition(top100);
    }
  }, [top100]);

  if (activeSection === "songs") {
    return <TopSongs />;
  }

  if (
    !albumsPosition ||
    (albumsPosition.length === 0 && activeSection === false)
  ) {
    return <p className="p-5 text-xl">You have to add albums first</p>;
  }

  if (accountSelected) return <Account />;

  if (activeSection === "albums") {
    return (
      <div className="p-10">
        <Album100
          albumsPosition={albumsPosition}
          setAlbumsPosition={setAlbumsPosition}
          user={user}
          setUser={setUser}
          isAlbumSelected={isAlbumSelected}
          setAlbumData={setAlbumData}
          albumData={albumData}
          setActiveSection={setActiveSection}
        />
        <button
          onClick={() => setActiveSection(null)}
          className="fixed right-10 bottom-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="text-white">
      {albumSelected ? (
        <>
          <Album
            albumData={albumData}
            isAlbumSelected={isAlbumSelected}
            setAlbumsMainPage={setAlbumsMainPage}
            albumsMainPage={albumsMainPage}
          />
        </>
      ) : (
        <>
          <div className="absolute px-11 -translate-y-6 flex w-full justify-between">
            <p
              onClick={() => setIsShowRating((rating) => !rating)}
              className="bg-[#2A2A2A] p-3 py-2 rounded-3xl px-5 cursor-pointer"
            >
              {capitalizeWords("show rating")}
            </p>
            <FilterAlbums
              setAlbumsMainPage={setAlbumsMainPage}
              albumsMainPage={albumsMainPage}
            />
          </div>
          <AlbumsMainPage
            albumsMainPage={albumsMainPage}
            isAlbumSelected={isAlbumSelected}
            setAlbumData={setAlbumData}
            isShowRating={isShowRating}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
