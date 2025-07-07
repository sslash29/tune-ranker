import { useNavigate } from "react-router-dom";
import capitalizeWords from "../helpers/capatalize";
import isArabic from "../helpers/isArabic";

function AlbumTop100({
  albumData,
  handleAlbumClick,
  index,
  handleChangePosition,
  albumsPosition,
  edit,
  setEdit,
  albumIndex,
  isAlbumSelected,
  setAlbumData,
  setActiveSection,
}) {
  const navigate = useNavigate();

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Find this album's position in the albumsPosition array
  const positionIndex = albumsPosition.findIndex(
    (item) => item.albumData?.id === albumData.albumData?.id
  );

  const rank = getOrdinal(positionIndex + 1); // +1 because index starts at 0

  const goToAlbum = () => {
    setActiveSection(null);
    isAlbumSelected(true);
    setAlbumData(album);
    navigate("/");
  };

  let artists = [];
  console.log(albumsPosition);
  const album = albumData.albumData;
  return (
    <div>
      <h2 className="text-3xl">{rank}</h2>
      <div className="bg-[#2A2A2A] p-5 rounded-xl">
        <div className="flex gap-3 w-[420px] items-start">
          <div className="scale-110 translate-y-2">
            <img
              src={album?.images?.[2]?.url || ""}
              alt="img"
              className="cursor-pointer"
              onDoubleClick={goToAlbum}
            />
          </div>
          <div className="flex flex-col ">
            <h3
              className={`text-2xl cursor-pointer ${
                isArabic(album.name) ? "arabic-font" : ""
              }`}
            >
              {album.name.length > 20
                ? `${capitalizeWords(album.name).slice(0, 22)}...`
                : capitalizeWords(album.name)}
            </h3>
            <div className="flex items-center gap-1.5">
              {album.artists.map((artist, index) => {
                artists.push(artist);
                return (
                  <p
                    className="text-white opacity-50 translate-x-1 text-xs"
                    key={artist.id}
                  >
                    {artist.name}
                    {index < album.artists.length - 1 && <span>,&nbsp;</span>}
                  </p>
                );
              })}
              <img
                src="dot.svg"
                alt="dot"
                className="translate-0.5 translate-x-1 "
              />
              <p className="opacity-50 translate-x-1 text-xs">
                {album["total_tracks"] || "unknown"} tracks
              </p>
            </div>
            <div className="flex items-center -translate-x-2">
              <button
                onClick={goToAlbum}
                className="bg-[#252525] p-3 rounded-lg text-md flex justify-center items-center  cursor-pointer scale-85 opacity-80"
              >
                View
              </button>
              <button
                onClick={() => handleAlbumClick(index)}
                className="bg-[#252525] p-3 rounded-lg text-md cursor-pointer scale-85 opacity-80"
              >
                Edit Ranking
              </button>

              {albumIndex === index && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePosition(index);
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    min="1"
                    max={albumsPosition.length}
                    value={edit}
                    onChange={(e) => setEdit(e.target.value)}
                    className="bg-[#1f1f1f] text-white text-md p-1 rounded w-12"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 px-2 py-1 rounded text-sm"
                  >
                    OK
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <textarea
          className="bg-[#252525] w-full p-3 resize-none h-[150px] rounded-lg -translate-x-1.5 mt-2"
          placeholder="nothing here..."
          value={albumData.review}
          disabled
        />
      </div>
    </div>
  );
}

export default AlbumTop100;
