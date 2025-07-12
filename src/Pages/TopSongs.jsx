import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import supabase from "../supabaseClient";
import capitalizeWords from "../helpers/capatalize";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratedSongs.map((song, index) => {
          const isSelected = selectedIndex === index;

          return (
            <div key={index}>
              <div className="text-xl font-semibold mb-1">{index + 1}</div>
              <div className="bg-[#2A2A2A] p-5 rounded-xl flex gap-4 w-full max-w-[400px]">
                {/* Album Image */}
                <div className="min-w-[100px] max-w-[100px]">
                  <img
                    src={song.albumImg || ""}
                    alt="album"
                    className="w-full h-[100px] object-cover rounded"
                  />
                </div>

                {/* Song Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {capitalizeWords(song.trackName || "Unknown")}
                  </h3>
                  <p className="text-sm text-gray-400">{song.albumInfo}</p>
                  <div className="mt-1">
                    <StaticStarRating rating={song.rating} />
                  </div>

                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <button
                      onClick={() =>
                        setSelectedIndex(isSelected ? null : index)
                      }
                      className="bg-[#252525] p-2 px-4 rounded-lg text-sm opacity-80"
                    >
                      {isSelected ? "Cancel" : "Edit Ranking"}
                    </button>

                    {isSelected && (
                      <form
                        onSubmit={handleSubmitPosition}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="number"
                          min="1"
                          max={ratedSongs.length}
                          value={newPosition}
                          onChange={(e) => setNewPosition(e.target.value)}
                          className="bg-[#1f1f1f] text-white text-sm p-1 rounded w-16"
                        />
                        <button
                          type="submit"
                          className="bg-green-600 px-2 py-1 rounded text-sm"
                        >
                          OK
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopSongs;
