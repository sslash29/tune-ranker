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

  function submit() {
    if (value.trim()) {
      setShouldFetch(true);
    }
  }

  return (
    <div className="bg-[#2A2A2A] text-white rounded-4xl ">
      <div className="flex justify-between gap-2 w-[400px] items-center">
        <input
          className="opacity-40 p-4 transition-all outline-0 w-[350px]"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button
          className="px-2.5 border-0 cursor-pointer hover:scale-90 transition-all"
          onClick={submit}
        >
          <img src="Search.svg" alt="search" />
        </button>
      </div>

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
