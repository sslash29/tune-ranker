import { useEffect, useState } from "react";
import StarRate from "./StarRate";

function TracksRated({ tracks = [], albumName, artists = [] }) {
  const [trackRatings, setTrackRatings] = useState(() => {
    const artistNames = artists.map((artist) => artist.name);
    const localStorageKey =
      artistNames.length === 1
        ? `tracksRated-${albumName}-${artistNames[0]}`
        : `tracksRated-${albumName}-${artistNames.join(" & ")}`;

    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue ? JSON.parse(storedValue) : {};
  });

  const artistNames = artists.map((artist) => artist.name);
  const localStorageArtistKeyStr =
    artistNames.length === 1 ? artistNames[0] : artistNames.join("&");

  useEffect(() => {
    localStorage.setItem(
      `tracksRated-${albumName}-${localStorageArtistKeyStr}`,
      JSON.stringify(trackRatings)
    );
  }, [trackRatings, albumName]);

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
  }

  function handleTrackRatingChange(trackId, newRating) {
    setTrackRatings((prevRatings) => ({
      ...prevRatings,
      [trackId]: newRating,
    }));
  }

  return (
    <div className="flex flex-col h-[495px] overflow-y-auto">
      {tracks.length === 0 ? (
        <h1>Sorry No Tracks</h1>
      ) : (
        tracks.map((track, index) => {
          const durationStr = formatDuration(track.duration_ms);
          const currentRating = trackRatings[track.id] || 0;

          return (
            <div
              key={track.id}
              className="track w-[776px] flex items-center justify-between p-3"
            >
              <div className="text-xl opacity-90 w-[500px]">
                <span className="track-number mr-2.5">{index + 1}</span>
                {track.name}
              </div>
              <img src="Pipe.svg" alt="pipe" />
              <StarRate
                rating={currentRating}
                setRating={(newRating) =>
                  handleTrackRatingChange(track.id, newRating)
                }
                size={24}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default TracksRated;
