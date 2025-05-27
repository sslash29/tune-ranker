import { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import AlbumSearch from "./AlbumSearch";
import { AlbumSearchContext } from "../context/AlbumSearchContext";

function SearchBar({ isAlbumSelected, setAlbumData }) {
  const [value, setValue] = useState("");
  const { shouldFetch, setShouldFetch } = useContext(AlbumSearchContext);
  const { token } = useContext(AlbumSearchContext);
  const url =
    shouldFetch && value
      ? `https://localhost:5000/api/search-album?query=${encodeURIComponent(
          value
        )}`
      : null;

  const headers = undefined; // no need to send token from frontend now

  const { data, error } = useFetch(url, {
    headers,
    skip: !token,
  });

  const albumsData = data?.albums?.items || [];
  console.dir(data);

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
              img={album.images[2]?.url || album.images[1]?.url || ""}
              artist={album.artists[0]?.name}
              data={album}
              isAlbumSelected={isAlbumSelected}
              setAlbumData={setAlbumData}
            />
          ))}
        </div>
      )}

      {shouldFetch && error && <p>Error fetching data: {error.message}</p>}
    </div>
  );
}

export default SearchBar;
