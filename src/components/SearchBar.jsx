import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import AlbumSearch from "./AlbumSearch";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import supabase from "../supabaseClient";
import AccountSearch from "./AccountSearch";

function SearchBar({ isAlbumSelected, setAlbumData, setActiveSection }) {
  const [value, setValue] = useState("");
  const [whichFetch, setWhichFetch] = useState("albums");
  const [accountsData, setAccountsData] = useState([]);
  const [accountsFetched, setAccountsFetched] = useState(false);
  const [accountsError, setAccountsError] = useState(null);

  const { shouldFetch, setShouldFetch, token } = useContext(AlbumSearchContext);

  const url =
    shouldFetch && value && whichFetch === "albums"
      ? `https://localhost:5000/api/search-album?query=${encodeURIComponent(
          value
        )}`
      : null;

  const { data, error } = useFetch(url, {
    headers: undefined,
    skip: !token || whichFetch !== "albums",
  });

  const albumsData = data?.albums?.items || [];

  function submit() {
    if (value.trim()) {
      setShouldFetch(true);
      setWhichFetch("albums");
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShouldFetch(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setShouldFetch]);

  const handleAccountsClick = async () => {
    setWhichFetch("accounts");
    if (!accountsFetched) {
      try {
        const { data, error } = await supabase
          .from("Accounts")
          .select("id, username, avatar_url, albums, favoritealbumsprofile")
          .limit(3);

        console.log(data);
        if (error) throw error;

        const usersWithAvatars = data.map((user) => {
          const { data: publicData } = supabase.storage
            .from("avatar")
            .getPublicUrl(user.avatar_url);

          const avatarUrl = publicData?.publicUrl || null;

          return {
            ...user,
            avatarUrl,
          };
        });

        setAccountsData(usersWithAvatars);
        setAccountsFetched(true);
        setAccountsError(null);
      } catch (err) {
        setAccountsError(err);
      }
    }
  };

  return (
    <div className="bg-[#2A2A2A] text-white rounded-4xl">
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

      {shouldFetch && (
        <div className="absolute bg-[#252525] w-[350px] translate-x-7 opacity-90 rounded-lg p-5 flex flex-col gap-5 z-50 shadow-xl translate-y-3">
          <div className="flex gap-3 text-xl bg-[#2b2b2b] cursor-pointer">
            <h2
              className={`px-2 py-1 ${
                whichFetch === "albums" ? "underline" : ""
              }`}
              onClick={() => setWhichFetch("albums")}
            >
              Albums
            </h2>
            <h2
              className={`px-2 py-1 ${
                whichFetch === "accounts" ? "underline" : ""
              }`}
              onClick={handleAccountsClick}
            >
              Accounts
            </h2>
          </div>

          {whichFetch === "albums" &&
            albumsData.map((album, index) => (
              <AlbumSearch
                key={index}
                name={album.name}
                img={album.images[2]?.url || album.images[1]?.url || ""}
                artist={album.artists[0]?.name}
                data={album}
                isAlbumSelected={isAlbumSelected}
                setAlbumData={setAlbumData}
                setActiveSection={setActiveSection}
              />
            ))}

          {whichFetch === "accounts" &&
            accountsData.map((user) => <AccountSearch user={user} />)}

          {whichFetch === "accounts" && accountsError && (
            <p className="text-red-400">
              Error fetching accounts: {accountsError.message}
            </p>
          )}
        </div>
      )}

      {shouldFetch && whichFetch === "albums" && error && (
        <p className="text-red-400">Error fetching albums: {error.message}</p>
      )}
    </div>
  );
}

export default SearchBar;
