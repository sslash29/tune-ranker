import { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import AlbumSearch from "./AlbumSearch";
import { AlbumSearchContext } from "../context/AlbumSearchContext";

function SearchBar({ isAlbumSelected, setAlbumData }) {
  const [value, setValue] = useState("");
  const { shouldFetch, setShouldFetch } = useContext(AlbumSearchContext);

  const API_KEY = import.meta.env.VITE_API_KEY; // ✅ updated for Vite

  const url =
    shouldFetch && value
      ? `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${value}&api_key=${API_KEY}&format=json`
      : null;

  const { data } = useFetch(url);
  const albumsData = data?.results?.albummatches?.album?.slice(0, 3) || [];
  function submit() {
    if (value.trim()) {
      setShouldFetch(true);
    }
  }

  return (
    <div id="searchbar-container">
      <input
        id="searchbar"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button
        style={{
          padding: "7px 10px",
          border: "none",
          color: "white",
          backgroundColor: "#3f3939",
          cursor: "pointer",
        }}
        onClick={submit}
      >
        Submit
      </button>
      {shouldFetch && albumsData.length > 0 && (
        <div className="album-navbar-holder">
          {albumsData.map((album, index) => (
            <AlbumSearch
              key={index}
              name={album.name}
              img={album.image[1]?.["#text"] || ""}
              artist={album.artist}
              data={album}
              isAlbumSelected={isAlbumSelected}
              setAlbumData={setAlbumData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
