import { useContext, useState } from "react";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import capitalizeWords from "../helpers/capatalize";
import AlbumLog from "./AlbumLog";

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
  const [albumClick, setAlbumClick] = useState(false);
  const [isAlbumLog, setIsAlbumLog] = useState(false);
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

  return isAlbumLog ? (
    <AlbumLog
      albumData={albumData}
      tracks={data?.items}
      setIsAlbumLog={setIsAlbumLog}
      setIsAlbumSelected={isAlbumSelected}
      albumsMainPage={albumsMainPage}
      setAlbumsMainPage={setAlbumsMainPage}
    />
  ) : (
    <div className="p-7 pl-12 pt-15 bg-[#191919] h-dvh flex text-white gap-10 items-start">
      <div>
        <img
          src={albumData.images?.[0].url}
          alt="album"
          className={
            albumClick
              ? `album-cover-hover rounded-xl scale-105 transition-all`
              : `album-cover rounded-xl hover:scale-105 transition-all ease-linear`
          }
          onClick={() => setAlbumClick((albumClick) => !albumClick)}
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
        <button
          onClick={() => setIsAlbumLog(true)}
          className="bg-[#252525] p-3 rounded-xl mt-2 text-xl flex justify-center gap-2 items-center w-[545px] cursor-pointer"
        >
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
