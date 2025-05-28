import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Album100 from "../components/Album100"; // import your component
import TopSongs from "./TopSongs";

function Top100({ isAlbumSelected, setAlbumData }) {
  const [albumsPosition, setAlbumsPosition] = useState([]);
  const { top100, user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null); // 'albums' | 'songs' | 'artists'

  useEffect(() => {
    if (Object.keys(top100).length === 0) navigate("/");
    if (top100) {
      setAlbumsPosition(top100 || []);
    }
  }, [top100]);

  // Render the album list component when "Top 100 Albums" is clicked
  if (activeSection === "albums") {
    return (
      <div className="p-5">
        <h2 className="text-3xl font-bold mb-4">Top 100 Albums</h2>
        <Album100
          albumsPosition={albumsPosition}
          setAlbumsPosition={setAlbumsPosition}
          user={user}
          setUser={setUser}
          isAlbumSelected={isAlbumSelected}
          setAlbumData={setAlbumData}
        />
        <button
          onClick={() => setActiveSection(null)}
          className="absolute right-10 bottom-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back
        </button>
      </div>
    );
  }

  if (activeSection === "songs") {
    return <TopSongs />
  }

  return (
    <div className="p-5 flex justify-between">
      <div
        className="w-[300px] h-[300px] bg-blue-300 text-white text-xl flex justify-center items-center rounded-2xl cursor-pointer"
        onClick={() => setActiveSection("albums")}
      >
        Top 100 Albums
      </div>
      <div
        className="w-[300px] h-[300px] bg-blue-300 text-white text-xl flex justify-center items-center rounded-2xl cursor-pointer"
        onClick={() => setActiveSection("songs")}
      >
        Top 100 Songs
      </div>
      <div
        className="w-[300px] h-[300px] bg-blue-300 text-white text-xl flex justify-center items-center rounded-2xl cursor-pointer"
        onClick={() => setActiveSection("artists")}
      >
        Top 100 Artists
      </div>
    </div>
  );
}

export default Top100;
