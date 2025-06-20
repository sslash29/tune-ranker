import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import supabase from "../supabaseClient";

// Helper: parse album and artist from albumInfo
function parseAlbumInfo(albumInfo) {
  const parts = albumInfo.split("-");
  if (parts.length === 2) {
    return { album: parts[0], artists: parts[1].split("&") };
  }
  const artistPart = parts[parts.length - 1];
  const album = parts.slice(0, parts.length - 1).join("-");
  return { album, artists: artistPart.split("&") };
}

// Star rating
function StaticStarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const full = index + 1;
        const isHalf = rating === index + 0.5;
        const isFull = rating >= full;

        if (isHalf) {
          return <FaStarHalfAlt key={index} color="#2A75E4" size={20} />;
        } else {
          return (
            <FaStar
              key={index}
              color={isFull ? "#2A75E4" : "gray"}
              size={20}
              stroke="black"
            />
          );
        }
      })}
    </div>
  );
}

function TopSongs() {
  const { user } = useContext(UserContext);
  const [ratedSongs, setRatedSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newPosition, setNewPosition] = useState("");

  useEffect(() => {
    async function fetchTop100Songs() {
      const { data, error } = await supabase
        .from("Accounts")
        .select("top100songs")
        .eq("id", user.id);

      if (error || !data || data.length === 0) {
        console.error("Error fetching songs:", error);
        return;
      }

      setRatedSongs(data[0].top100songs || []);
    }

    if (user?.id) {
      fetchTop100Songs();
    }
  }, [user?.id]);

  const handleSubmitPosition = async (e) => {
    e.preventDefault();
    const pos = parseInt(newPosition, 10);

    if (isNaN(pos) || pos < 1 || pos > ratedSongs.length) return;

    const updated = [...ratedSongs];
    const [movedItem] = updated.splice(selectedIndex, 1);
    updated.splice(pos - 1, 0, movedItem);

    setRatedSongs(updated);

    const { error } = await supabase
      .from("Accounts")
      .update({ top100songs: updated })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating position:", error);
    }

    setSelectedIndex(null);
    setNewPosition("");
  };

  return (
    <div className="p-5">
      {ratedSongs.length < 1 && <p>You haven't rated any songs yet</p>}
      <div className="flex flex-col gap-4">
        {ratedSongs.map((song, index) => {
          const { album, artists } = parseAlbumInfo(song.albumInfo);
          const isSelected = selectedIndex === index;

          return (
            <div
              key={index}
              className={`flex flex-col rounded-xl shadow p-4 w-[800px] bg-white ${
                isSelected ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              onDoubleClick={() => setSelectedIndex(null)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    {index + 1}. {song.track}
                  </p>
                  <p className="text-sm text-gray-600">{album}</p>
                  <p className="text-sm text-gray-600">
                    Artist(s): {artists.join(", ")}
                  </p>
                </div>
                <StaticStarRating rating={song.rating} />
              </div>

              {isSelected && (
                <form
                  onSubmit={handleSubmitPosition}
                  className="flex gap-4 mt-2"
                >
                  <input
                    type="number"
                    min="1"
                    max={ratedSongs.length}
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="border p-2 rounded w-[200px]"
                    placeholder="Enter new position"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Move
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopSongs;
