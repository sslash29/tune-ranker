import { useState } from "react";
import Album from "../components/Album";
import AlbumsMainPage from "../components/AlbumsMainPage";
import FilterAlbums from "../components/FilterAlbums";
import { FaLeaf } from "react-icons/fa6";
import capitalizeWords from "../helpers/capatalize";

function HomePage({
  isAlbumSelected,
  setAlbumData,
  albumSelected,
  albumData,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const [isShowRating, setIsShowRating] = useState(false);
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
