import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import AlbumTop100 from "../components/AlbumTop100";
import supabase from "../supabaseClient";

function Top100({ isAlbumSelected, setAlbumData }) {
  const [albumsPosition, setAlbumsPosition] = useState([]);
  const { top100, user, setUser } = useContext(UserContext);
  const [albumIndex, setAlbumIndex] = useState(null);
  const [edit, setEdit] = useState("");

  useEffect(() => {
    if (top100) {
      setAlbumsPosition(top100);
    }
  }, [top100]);

  const handleAlbumClick = (index) => {
    setAlbumIndex(index);
  };

  const handleChangePosition = async (index) => {
    const newAlbumPosition = [...albumsPosition];
    const album = newAlbumPosition[index];

    const newPosition = parseInt(edit);

    if (
      isNaN(newPosition) ||
      newPosition < 1 ||
      newPosition > newAlbumPosition.length
    ) {
      alert(
        `Please enter a valid position between 1 and ${newAlbumPosition.length}`
      );
      return;
    }

    newAlbumPosition.splice(index, 1);
    newAlbumPosition.splice(newPosition - 1, 0, album);

    setAlbumsPosition(newAlbumPosition);

    // Update the `top100` and `albums` in the database
    const { data, error } = await supabase
      .from("Accounts")
      .update({ top100: newAlbumPosition })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating top100:", error);
      return;
    }

    // Optionally, re-fetch user data
    const { data: userData, error: userError } = await supabase
      .from("Accounts")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    } else {
      setUser(userData); // Update user context with new data
    }

    setEdit("");
    setAlbumIndex(null);
  };

  return (
    <div className="p-5">
      <ol className="flex flex-col gap-5">
        {albumsPosition?.map((album, key) => (
          <AlbumTop100
            key={key}
            album={album}
            handleAlbumClick={handleAlbumClick}
            index={key}
            handleChangePosition={handleChangePosition}
            albumsPosition={albumsPosition}
            edit={edit}
            setEdit={setEdit}
            albumIndex={albumIndex}
            isAlbumSelected={isAlbumSelected}
            setAlbumData={setAlbumData}
          />
        ))}
      </ol>
    </div>
  );
}

export default Top100;
