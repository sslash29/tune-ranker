import { useContext, useState, useEffect } from "react";
import AlbumSearch from "./AlbumSearch";
import { AlbumSearchContext } from "../context/AlbumSearchContext";

function SearchAlbumFav({ isAlbumSelected, setAlbumData, token, onSelect }) {
  const [value, setValue] = useState("");
  const { shouldFetch, setShouldFetch } = useContext(AlbumSearchContext);
  const [albumsData, setAlbumsData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      if (shouldFetch && value && token) {
        try {
          const res = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              value
            )}&type=album&limit=8`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          setAlbumsData(data.albums.items);
        } catch (error) {
          console.error("Spotify fetch failed", error);
        }
        setShouldFetch(false);
      }
    };

    fetchAlbums();
  }, [shouldFetch, token, value, setShouldFetch]);

  return (
    <div className="bg-black text-white">
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search album..."
          className="flex-1 p-2 border rounded-l"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-r ml-2"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {albumsData.map((album, index) => {
          console.log(album);
          return (
            <AlbumSearch
              key={index}
              name={album.name}
              img={album.images[2]?.url || ""}
              favAlbumImg={album.images[1]?.url || ""}
              artist={album.artists[0]?.name}
              data={album}
              isAlbumSelected={isAlbumSelected}
              setAlbumData={setAlbumData}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SearchAlbumFav;
