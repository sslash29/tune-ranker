import { useContext, useState } from "react";
import StarRate from "./StarRate";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import Tags from "./Tags";
import useFetch from "../hooks/useFetch";

function AlbumV2({
  albumData,
  isAlbumSelected,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const [rating, setRating] = useState(() => {
    const key = `albumRating-${albumData.name}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : 0;
  });

  const { user } = useContext(UserContext);
  const AlbumId = albumData?.uri.split(":")[2];
  const artistId = albumData?.artists[0].id;
  let artists = [];

  const { data } = useFetch(
    `https://localhost:5000/api/album-tracks?AlbumId=${encodeURIComponent(
      AlbumId
    )}`,
    { headers: undefined }
  );

  const { data: artistData } = useFetch(
    `https://localhost:5000/api/artist-data?artistId=${encodeURIComponent(
      artistId
    )}`,
    { headers: undefined }
  );

  const { data: artistGenre } = useFetch(
    `https://localhost:5000/api/artist-genre?artistId=${encodeURIComponent(
      artistId
    )}`,
    { headers: undefined }
  );

  console.log(albumData);
  console.log(artistGenre);
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
    const key = `albumRating-${albumData.name}`;
    localStorage.setItem(key, JSON.stringify(rating)); // ✅ Save rating locally

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

    // ✅ Fetch existing top100 from DB
    const { data: userData, error: fetchError } = await supabase
      .from("Accounts")
      .select("top100")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching top100 albums:", fetchError);
      return;
    }

    const currentTop100 = userData?.top100 || [];

    const updatedTop100Albums = [
      ...currentTop100.filter(
        (album) => (album.data || album.albumData)?.name !== albumData.name
      ),
      newAlbum,
    ];

    // ✅ Update albums
    const { error: albumsError } = await supabase
      .from("Accounts")
      .update({ albums: updatedAlbums })
      .eq("id", user.id);

    // ✅ Update top100
    const { error: top100Error } = await supabase
      .from("Accounts")
      .update({ top100: updatedTop100Albums })
      .eq("id", user.id);

    if (albumsError) console.error("Error updating albums:", albumsError);
    if (top100Error) console.error("Error updating top100:", top100Error);
    if (!albumsError && !top100Error) console.log("Albums saved successfully");
  }
  async function handleDelete(name, artists) {
    // Remove album from local albums
    const updatedAlbums = albumsMainPage.filter(
      (album) => album.albumData.name !== name
    );

    // Remove localStorage keys
    const artistNames = artists.map((artist) => artist.name);
    const localStorageTrackKey =
      artistNames.length === 1
        ? `tracksRated-${name}-${artistNames[0]}`
        : `tracksRated-${name}-${artistNames.join(" & ")}`;
    const localStorageAlbumKey = `albumRating-${name}`;
    localStorage.removeItem(localStorageTrackKey);
    localStorage.removeItem(localStorageAlbumKey);

    // ✅ Fetch current top100 from DB
    const { data: userData, error: fetchError } = await supabase
      .from("Accounts")
      .select("top100")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching top100 for deletion:", fetchError);
      return;
    }

    const currentTop100 = userData?.top100 || [];

    // ✅ Filter the album out of top100 too
    const updatedTop100 = currentTop100.filter(
      (album) => (album.data || album.albumData)?.name !== name
    );

    // ✅ Update Supabase
    const { error: updateError } = await supabase
      .from("Accounts")
      .update({
        albums: updatedAlbums,
        top100: updatedTop100,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating after delete:", updateError);
    } else {
      console.log("Album deleted successfully");
    }

    isAlbumSelected(false);
  }

  return (
    <div className="p-7 flex flex-col gap-9">
      <div>
        <div className="flex h-[300px] justify-around items-center">
          <img
            src={albumData.images?.[0].url}
            alt="Album cover"
            className="w-[350px] h-[350px]"
          />
          <div className="bg-[#d9d9d9] w-[870px] h-[254px] p-2 rounded-xl">
            <div className="flex justify-between w-full h-[40%] mt-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-5xl">{albumData.name}</h2>
                {albumData.artists.map((artist) => {
                  artists.push(artist);
                  return (
                    <p className="text-gray-500 translate-x-2" key={artist.id}>
                      {artist.name}
                    </p>
                  );
                })}
              </div>
              <div className="flex flex-col gap-4 h-[230px]">
                <div className="flex flex-col text-xl gap-4 self-end">
                  <p>Length: {albumLength}</p>
                  <p>Tracks: {albumData["total_tracks"] || "unknown"}</p>
                  <p>Date: {albumData.release_date.split("-")[0]}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-4">
              <StarRate rating={rating} setRating={setRating} size="2.2rem" />
            </div>

            <div className="flex justify-between items-center mt-7">
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
                  onClick={() =>
                    handleDelete(albumData.name, albumData.artists)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-10 mt-11 translate-x-12">
          <div>
            <Tracks
              tracks={data?.items}
              albumName={albumData.name}
              artists={artists}
            />
          </div>
          <div className="flex mt-6 gap-4">
            {artistGenre?.genres.length === 0 ? (
              <p className="w-max">this artist isn't defined by a genre</p>
            ) : (
              artistGenre?.genres.map((genre) => (
                <div>
                  <p className=" w-max text-blue-500 font-bold border-blue-500 border-2 flex items-center justify-center p-2">
                    {genre}
                  </p>
                </div>
              ))
            )}
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

export default AlbumV2;
