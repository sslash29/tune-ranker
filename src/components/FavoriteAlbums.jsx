import { useContext, useEffect, useState } from "react";
import AlbumFavorites from "./AlbumFavorites";
import { UserContext } from "../context/UserContext";
import supabase from "../supabaseClient";

function FavoriteAlbums({ editMode }) {
  const { user, viewedUser } = useContext(UserContext);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const id = viewedUser?.id || user?.id;
    if (!id) return; // ⛔ Avoid calling Supabase if ID is undefined

    async function getAlbumFavorites() {
      setLoading(true);

      const { data, error } = await supabase
        .from("Accounts")
        .select("favoritealbumsprofile")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        return;
      }

      const favorites = data.favoritealbumsprofile || [];
      setFavoriteAlbums(favorites);
      setLoading(false);
    }

    getAlbumFavorites();
  }, [user?.id, viewedUser?.id]);

  const displayAlbums = [...favoriteAlbums];
  while (displayAlbums.length < 4) {
    displayAlbums.push(null);
  }

  return (
    <div className="w-[1280px]">
      {loading ? (
        <div className="text-white text-lg">Loading favorites...</div>
      ) : (
        <div className="flex gap-6.5">
          {displayAlbums.map((album, index) => (
            <AlbumFavorites
              key={index}
              name={album?.name}
              image={album?.favAlbumImg}
              editMode={editMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteAlbums;
