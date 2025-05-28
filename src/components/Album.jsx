import { useContext, useState } from "react";
import StarRate from "./StarRate";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import Tags from "./Tags";
import useFetch from "../hooks/useFetch";

function Album({
  albumData,
  isAlbumSelected,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const [rating, setRating] = useState(0);
  const { user } = useContext(UserContext);
  const AlbumId = albumData?.uri.split(":")[2];
  const artistId = albumData?.artists[0].id;
  let artists = []
  const { data } = useFetch(
    `https://localhost:5000/api/album-tracks?AlbumId=${encodeURIComponent(
      AlbumId
    )}`,
    {
      headers: undefined,
    }
  );

  const { data: artistData } = useFetch(
    `https://localhost:5000/api/artist-data?artistId=${encodeURIComponent(
      artistId
    )}`,
    {
      headers: undefined,
    }
  );

  console.log(data);

  function formatPlayCount(count) {
    if (!count) return "N/A";
    const num = Number(count);
    if (isNaN(num)) return count;
    return num >= 1_000_000_000
      ? `${(num / 1_000_000_000).toFixed(1)}B`
      : `${(num / 1_000_000).toFixed(1)}M`;
  }

  function getFormattedAlbumLength(tracks) {
    if (!Array.isArray(tracks)) return "N/A";
    const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  const albumLength = getFormattedAlbumLength(data?.items);

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
      <div>
        <div className="flex h-[300px] justify-around items-center">
          <img
            src={albumData.images?.[1].url}
            alt="Album cover"
            className="w-[350px] h-[350px]"
          />
          <div className="bg-[#d9d9d9] w-[812px] h-[249px] p-2">
            <div className="flex justify-between w-full h-[40%] mt-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-5xl">{albumData.name}</h2>
                {albumData.artists.map((artist) => {
                  artists.push(artist)
                  console.log(artists)
                  return (
                  <p className="text-gray-500 translate-x-2" key={artist.id}>
                    {artist.name}
                  </p>
                )})}
              </div>
              <div className="flex flex-col gap-4 h-[230px]">
                <div className="flex flex-col text-xl gap-4 self-end">
                  <p>Length: {albumLength}</p>
                  <p>Tracks: {albumData["total_tracks"] || "unknown"}</p>
                  <p>Date: {albumData.release_date.split("-")[0]}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <StarRate rating={rating} setRating={setRating} size="2.2rem" />
            </div>

            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-xl">
                spotify followers:
                <span className="text-blue-400">
                  {formatPlayCount(artistData?.followers?.total)}{" "}
                </span>
              </p>
              <div className="flex justify-between w-[300px]">
                <button
                  className="bg-blue-500 p-2.5 px-10 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-blue-500 p-2.5 px-10 text-white rounded"
                  onClick={() => handleDelete(albumData.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-10 mt-11 translate-x-16">
          <div>
            <Tracks tracks={data?.items} albumName={albumData.name} artists={artists} />
          </div>

          <div className="mt-4 flex flex-col items-center">
            <Tags tags={data?.album?.tags?.tag} />
            <p className="w-[792px] h-[392px]">{data?.album?.wiki?.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Album;
