import { useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

function RecentActivity() {
  const { user } = useContext(UserContext);
  const [recentAlbums, setRecentAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from("Accounts")
        .select("albums")
        .eq("id", user.id);

      if (error) {
        console.error("Error fetching albums:", error);
        return;
      }

      if (data && data.length > 0 && data[0].albums) {
        const sortedAlbums = [...data[0].albums].sort(
          (a, b) => b.addedAt - a.addedAt
        );
        setRecentAlbums(sortedAlbums);
      }
    };

    fetchAlbums();
  }, [user.id]);

  return (
    <div>
      <h3 className="text-xl font-semibold">Recent Albums</h3>
      <hr className="my-2" />
      <div className="flex gap-4 w-[1280px]">
        {recentAlbums
          .slice(0, 4) // 🔹 Limit to 4 albums here during mapping
          .map((album, index) => (
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
    </div>
  );
}

export default RecentActivity;
