import { useContext, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import SearchAlbumFav from "./SearchAlbumFav";

function AlbumFavorites() {
  const [isSearch, setIsSearch] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const { token } = useContext(AlbumSearchContext);

  const handleAddAlbum = () => setIsSearch(true);
  const handleClose = () => setIsSearch(false);

  const handleAlbumSelect = (album) => {
    setSelectedAlbum(album);
    setIsSearch(false);
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {/* Album Card (either plus or selected album) */}
      <div
        className="w-[300px] h-[300px] bg-gray-500 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden"
        onClick={!selectedAlbum ? handleAddAlbum : undefined}
      >
        {selectedAlbum ? (
          <img
            src={selectedAlbum.favAlbumImg}
            alt={selectedAlbum.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <FaCirclePlus color={"white"} size={30} />
        )}
      </div>

      {/* Search Modal */}
      {isSearch && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl relative w-[90%] max-w-md">
            <button
              className="absolute -top-7 -right-5 text-white font-bold text-lg rounded-full w-[30px] h-[30px] bg-orange-400"
              onClick={handleClose}
            >
              ✕
            </button>
            <SearchAlbumFav
              token={token}
              isAlbumSelected={() => {}}
              setAlbumData={() => {}}
              onSelect={handleAlbumSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AlbumFavorites;
