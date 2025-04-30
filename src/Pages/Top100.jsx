import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import AlbumTop100 from "../components/AlbumTop100";
import supabase from "../supabaseClient";

function Top100({ albumData }) {
  const [albumsPosition, setAlbumsPosition] = useState();
  const { top100, user } = useContext(UserContext);

  const [albumIndex, setAlbumIndex] = useState(null);
  const [edit, setEdit] = useState("");
  useEffect(() => {
    if (top100) {
      setAlbumsPosition(top100);
    }
  }, [top100]);

  const handleAlbumClick = function (index) {
    setAlbumIndex(index);
  };

  const handleChangePosition = async function (index) {
    // Create a new array to avoid direct state mutation
    const newAlbumPosition = [...albumsPosition];
    const album = newAlbumPosition[index];

    // Convert edit to a number
    const newPosition = parseInt(edit);

    // Validate position (using 1-based counting for user input)
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

    // Remove the album from its current position
    newAlbumPosition.splice(index, 1);

    // Insert it at the new position, but convert from 1-based to 0-based indexing
    newAlbumPosition.splice(newPosition - 1, 0, album);

    // Update state
    setAlbumsPosition(newAlbumPosition);
    console.log(user.id);

    const { data, error } = await supabase
      .from("Accounts")
      .update({ top100: newAlbumPosition })
      .eq("id", user.id);

    if (error) {
      console.error("error occured while updating top 100");
      return;
    }
    console.dir(data);
    // Reset the input and selection
    setEdit("");
    setAlbumIndex(null);
  };

  return (
    <div className="p-5">
      <ol className="flex flex-col gap-5">
        {albumsPosition?.map((album, key) => {
          return (
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
            />
          );
        })}
      </ol>
    </div>
  );
}

export default Top100;
