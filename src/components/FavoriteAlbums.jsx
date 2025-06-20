import { useContext, useEffect, useState } from "react";
import AlbumFavorites from "./AlbumFavorites";
import { UserContext } from "../context/UserContext";
import supabase from "../supabaseClient";

function FavoriteAlbums({ editMode }) {
  const { user } = useContext(UserContext);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  useEffect(() => {
    async function getAlbumFavorites() {
      const { data, error } = await supabase
        .from("Accounts")
        .select("favoritealbumsprofile")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      const favorites = data.favoritealbumsprofile || [];
      setFavoriteAlbums(favorites);
    }

    getAlbumFavorites();
  }, [user.id]);

  // Fill up to 4 albums (with placeholders if needed)
  const displayAlbums = [...favoriteAlbums];
  while (displayAlbums.length < 4) {
    displayAlbums.push(null);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">Favorite Albums</h3>
      <hr className="my-2" />
      <div className="flex gap-4 w-[1280px]">
        {displayAlbums.map((album, index) => {
          console.log(album);
          return (
            <AlbumFavorites
              key={index}
              name={album?.name}
              image={album?.favAlbumImg}
              editMode={editMode}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FavoriteAlbums;
