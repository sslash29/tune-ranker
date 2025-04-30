import { useEffect, useState } from "react";
import StarRate from "./StarRate";

function Tracks({ tracks = [], albumName }) {
  const [trackRatings, setTrackRatings] = useState(function () {
    const storedValue = localStorage.getItem(`tracksRated-${albumName}`);
    return storedValue ? JSON.parse(storedValue) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      `tracksRated-${albumName}`,
      JSON.stringify(trackRatings)
    );
  }, [trackRatings, albumName]);

  const handleRatingChange = (index, newRating) => {
    setTrackRatings((prevRatings) => ({
      ...prevRatings,
      [index]: newRating, // Update only the specific track rating
    }));
  };

  return (
    <div className="flex flex-col g-3">
      {tracks.length === 0 ? (
        <h1>Sorry No Tracks</h1>
      ) : (
        tracks.map((track, index) => {
          const trackDurationMinutes = Math.floor(track.duration / 60);
          const trackDurationSeconds = track.duration % 60;
          const isLessThanTenSec =
            trackDurationSeconds < 10
              ? `0${trackDurationSeconds}`
              : trackDurationSeconds;

          return (
            <div
              key={index}
              className="track w-[500px] flex items-center justify-between p-3 transition-all relative hover:scale-110 "
            >
              <div className="track-start">
                <span className="track-number">{index + 1}.</span>
                {track.name}
              </div>
              <div className="track-end">
                <span className="track-duration">{`${trackDurationMinutes}:${isLessThanTenSec}`}</span>
                <StarRate
                  rating={trackRatings[index] || 0} // Default to 0 if not set
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
