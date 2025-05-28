import { useEffect, useState } from "react";
import StarRate from "./StarRate";

function Tracks({ tracks = [], albumName, artists = [] }) {
  const [trackRatings, setTrackRatings] = useState(() => {
    const storedValue = localStorage.getItem(`tracksRated-${albumName}`);
    return storedValue ? JSON.parse(storedValue) : {};
  });

  const artistNames = artists.map(artist => artist.name)
  const localStorageArtistKeyStr = artistNames.length === 1 ? artistNames[0] : artistNames.join("&")

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
  }

  useEffect(() => {
    localStorage.setItem(
      `tracksRated-${albumName}-${localStorageArtistKeyStr}`,
      JSON.stringify(trackRatings)
    );
  }, [trackRatings, albumName]);

  const handleRatingChange = (index, newRating) => {
    setTrackRatings((prevRatings) => ({
      ...prevRatings,
      [index]: newRating,
    }));
  };

  return (
    <div className="flex flex-col g-3">
      {tracks.length === 0 ? (
        <h1>Sorry No Tracks</h1>
      ) : (
        tracks.map((track, index) => {
          const durationMs = track.duration_ms;
          const durationStr = formatDuration(durationMs);

          return (
            <div
              key={index}
              className="track w-[500px] flex items-center justify-between p-3 transition-all relative hover:scale-110"
            >
              <div className="track-start">
                <span className="track-number">{index + 1}.</span>
                {track.name}
              </div>
              <div className="track-end flex items-center gap-2">
                <span className="track-duration">{durationStr}</span>
                <StarRate
                  rating={trackRatings[index] || 0}
                  setRating={(newRating) =>
                    handleRatingChange(index, newRating)
                  }
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Tracks;
