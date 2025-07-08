import { useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

function RecentActivity() {
  const { user, viewedUser } = useContext(UserContext);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const id = viewedUser?.id || user?.id;
    if (!id) return; // ⛔ Don’t run if no ID available

    async function fetchAlbums() {
      setLoading(true);

      const { data, error } = await supabase
        .from("Accounts")
        .select("albums")
        .eq("id", id);

      if (error) {
        console.error("Error fetching albums:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0 && data[0].albums) {
        const sortedAlbums = [...data[0].albums].sort(
          (a, b) => b.addedAt - a.addedAt
        );
        setRecentAlbums(sortedAlbums);
      }

      setLoading(false);
    }

    fetchAlbums();
  }, [user?.id, viewedUser?.id]);

  return (
    <div className="w-[1280px]">
      {loading ? (
        <div className="text-white text-lg">Loading recent albums...</div>
      ) : (
        <div className="flex gap-4">
          {recentAlbums.slice(0, 4).map((album, index) => (
            <div
              key={index}
              className="w-[300px] h-[300px] bg-gray-500 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden"
            >
              <img
                src={album.albumData.images[1].url}
                className="w-full h-full object-cover rounded-xl"
                alt={album.albumData.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
