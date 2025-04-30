import { useContext, useState } from "react";
import StarRate from "./StarRate";
import useFetch from "../hooks/useFetch";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import Tags from "./Tags";

function Album({
  albumData,
  isAlbumSelected,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const [rating, setRating] = useState(0);
  const VITE_REACT_APP_API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const { data, _, loading } = useFetch(
    `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${VITE_REACT_APP_API_KEY}&artist=${albumData.artist}&album=${albumData.name}&format=json`
  );
  const { user } = useContext(UserContext);

  const tracks = data?.album?.tracks?.track;

  function formatPlayCount(count) {
    if (!count) return "N/A";
    const num = Number(count);
    if (isNaN(num)) return count;
    return num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)}B`
      : `${(num / 1_000_000).toFixed(1)}M`;
  }

  async function handleSave() {
    const newAlbum = {
      rating,
      albumData,
      addedAt: Date.now(),
    };

    isAlbumSelected(false);

    const updatedAlbums = [
      ...albumsMainPage.filter(
        (album) => (album.data || album.albumData)?.name !== albumData.name
      ),
      newAlbum,
    ];

    setAlbumsMainPage(updatedAlbums);

    const { error } = await supabase
      .from("Accounts")
      .update({ albums: updatedAlbums, top100: updatedAlbums })
      .eq("id", user.id);

    if (error) console.error("Error updating albums:", error);
    else console.log("Albums updated successfully.");
  }

  async function handleDelete(name) {
    const updatedAlbums = albumsMainPage.filter(
      (album) => album.albumData.name !== name
    );

    const { error } = await supabase
      .from("Accounts")
      .update({ albums: updatedAlbums, top100: updatedAlbums })
      .eq("id", user.id);

    if (error) console.error("Error deleting album:", error);
    isAlbumSelected(false);
  }

  return (
    <div className="p-7 flex flex-col gap-9">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="flex h-[300px] justify-around items-center">
            <img
              src={albumData.image?.[3]?.["#text"]}
              alt="Album cover"
              className="w-[350px] h-[350px]"
            />
            <div className="bg-[#d9d9d9] w-[812px] h-[249px] p-2">
              <div className="flex  justify-between w-full h-[40%] mt-2">
                <div className="flex flex-col gap-1">
                  <h2 className="text-5xl">{albumData.name}</h2>
                  <p className="text-gray-500 translate-x-2">
                    {albumData.artist}
                  </p>
                </div>
                <div className="flex flex-col gap-4  h-[230px]">
                  <div className="flex flex-col text-xl gap-4 self-end">
                    <p>Length: 1 hr</p>
                    <p>Tracks: {tracks?.length || "unknown"}</p>
                    <p>Date: 2016</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <StarRate rating={rating} setRating={setRating} size="2.2rem" />
              </div>

              <div className="flex justify-between items-center mt-5">
                <p className=" text-gray-500 text-xl">
                  last.fm listeners:{" "}
                  <span className="text-blue-400">
                    {formatPlayCount(data?.album?.playcount)}
                  </span>
                </p>
                <div className="flex justify-between w-[300px]">
                  <button
                    className=" bg-blue-500 p-2.5 px-10 text-white rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className=" bg-blue-500 p-2.5 px-10 text-white rounded"
                    onClick={() => handleDelete(albumData.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-10 mt-11 translate-x-16">
            <div className=" ">
              <Tracks tracks={tracks} albumName={albumData.name} />
            </div>

            <div className="mt-4  flex flex-col items-center">
              <Tags tags={data?.album?.tags?.tag} />
              <p className="w-[792px] h-[392px]">
                {data?.album?.wiki?.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Album;
