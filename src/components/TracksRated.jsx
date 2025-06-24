import { useContext, useEffect, useState } from "react";
import StarRate from "./StarRate";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

function TracksRated({ tracks = [], albumName, artists = [] }) {
  const [trackRatings, setTrackRatings] = useState({});
  const { user } = useContext(UserContext);
  console.log(tracks);
  const artistNames = artists.map((artist) => artist.name);
  const albumKey =
    artistNames.length === 1
      ? `tracksRated-${albumName}-${artistNames[0]}`
      : `tracksRated-${albumName}-${artistNames.join(" & ")}`;

  useEffect(() => {
    async function fetchTrackRatings() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("Accounts")
        .select("top100songs")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching track ratings:", error);
        return;
      }

      const top100songs = data?.top100songs || [];

      // Filter ratings for this albumKey
      const currentAlbumTracks = top100songs.filter(
        (item) => item.albumKey === albumKey
      );

      // Group them by trackId
      const groupedRatings = currentAlbumTracks.reduce(
        (acc, { track, rating }) => {
          acc[track] = rating;
          return acc;
        },
        {}
      );

      setTrackRatings(groupedRatings);
    }

    fetchTrackRatings();
  }, [albumKey, user?.id]);

  async function handleTrackRatingChange(trackId, newRating) {
    const updatedRatings = {
      ...trackRatings,
      [trackId]: newRating,
    };
    setTrackRatings(updatedRatings);

    const trackInfo = tracks.find((t) => t.id === trackId); // ✅ find the actual track object

    const newEntry = {
      albumKey,
      track: trackId,
      rating: newRating,
      trackName: trackInfo?.name || "Unknown", // ✅ include the track name safely
      albumInfo: `${albumName}-${artistNames.join(" & ")}`, // optional but consistent with your schema
    };

    try {
      const { data, error: fetchError } = await supabase
        .from("Accounts")
        .select("top100songs")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching before update:", fetchError);
        return;
      }

      const existing = data.top100songs || [];

      const filtered = existing.filter(
        (item) => !(item.albumKey === albumKey && item.track === trackId)
      );

      const updated = [...filtered, newEntry];

      const { error: updateError } = await supabase
        .from("Accounts")
        .update({ top100songs: updated })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating rating:", updateError);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
    }
  }

  return (
    <div className="flex flex-col h-[495px] overflow-y-auto">
      {tracks.length === 0 ? (
        <h1>Sorry No Tracks</h1>
      ) : (
        tracks.map((track, index) => {
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
