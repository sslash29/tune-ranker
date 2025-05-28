import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function TopSongs() {
  const {songs} = useContext(UserContext)
  return (
    <div>
      {songs.length < 1 && <p>You haven't any songs yet</p>}
      <div>
        {songs.map((song, index) => (
          <div key={index}>
            <span>{index}</span>
            <p>{song.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopSongs;
