import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShouldFetch(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    // Cleanup listener on unmount
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setShouldFetch]);

  return (
    <div className="bg-[#2A2A2A] text-white rounded-4xl ">
      <div className="flex justify-between gap-30 w-[500px] items-center relative">
        <input
          className="opacity-40 p-4 transition-all outline-0 w-[450px]"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button
          className="px-2.5 border-0 cursor-pointer hover:scale-90 transition-all absolute -right-20 scale-80"
          onClick={submit}
        >
          <img src="Search.svg" alt="search" />
        </button>
      </div>

      {shouldFetch && albumsData.length > 0 && (
        <div className="absolute bg-[#252525] w-[350px] translate-x-7 opacity-90 rounded-lg p-5 flex flex-col gap-5 z-50 shadow-xl translate-y-3">
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
