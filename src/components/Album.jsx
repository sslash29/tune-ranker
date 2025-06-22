import { useContext, useState } from "react";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import capitalizeWords from "../helpers/capatalize";

function Album({
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

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} hours`;
    } else {
      return `${minutes} minutes`;
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
    <div className="p-7 pl-12 pt-15 bg-[#191919] h-dvh flex text-white gap-10 items-start">
      <div>
        <img
          src={albumData.images?.[0].url}
          alt="album"
          className="rounded-xl"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <h2 className=" text-5xl">{capitalizeWords(albumData.name)}</h2>
        <div className="flex items-center gap-2">
          {albumData.artists.map((artist, index) => {
            artists.push(artist);
            return (
              <p
                className="text-white opacity-50 translate-x-2 text-xl "
                key={artist.id}
              >
                {artist.name}
                {index < albumData.artists.length - 1 && <span>,&nbsp;</span>}
              </p>
            );
          })}
          <img
            src="dot.svg"
            alt="dot"
            className=" translate-0.5 translate-x-1 "
          />
          <p className="opacity-50 translate-x-1 text-xl">
            {albumData["total_tracks"] || "unknown"} tracks
          </p>
          <p className="opacity-50 translate-x-38 text-xl">{albumLength}</p>
        </div>
        <button className="bg-[#252525] p-3 rounded-xl mt-2 text-xl flex justify-center gap-2 items-center w-[585px] ">
          <img src="Add.svg" alt="add" />
          Log Album
        </button>
        <div className="flex">
          <Tracks
            tracks={data?.items}
            albumName={albumData.name}
            artists={artists}
          />
        </div>
      </div>
    </div>
  );
}

export default Album;
