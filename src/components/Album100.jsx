import { useState } from "react";
import AlbumTop100 from "./AlbumTop100";
import supabase from "../supabaseClient";

function Album100({
  albumsPosition,
  setAlbumsPosition,
  user,
  setUser,
  isAlbumSelected,
  setAlbumData,
}) {
  const [albumIndex, setAlbumIndex] = useState(null);
  const [edit, setEdit] = useState("");

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

    // Move the album to the new position
    newAlbumPosition.splice(index, 1);
    newAlbumPosition.splice(newPosition - 1, 0, album);
    setAlbumsPosition(newAlbumPosition);

    // Update top100 in database
    const { error } = await supabase
      .from("Accounts")
      .update({ top100: newAlbumPosition })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating top100:", error);
      return;
    }

    // Re-fetch and update user
    const { data: userData, error: userError } = await supabase
      .from("Accounts")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    } else {
      setUser(userData);
    }

    setEdit("");
    setAlbumIndex(null);
  };

  const handleAlbumClick = (index) => {
    setAlbumIndex(index);
  };

  return (
    <ol className="flex flex-col gap-5">
      {albumsPosition?.map((album, key) => (
        <AlbumTop100
          key={key}
          album={album.albumData} // pass albumData directly
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
  );
}

export default Album100;
