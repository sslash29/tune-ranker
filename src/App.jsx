import { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Account from "./Pages/Account";
import { AlbumSearchProvider } from "./context/AlbumSearchContext";
import Form from "./Pages/Form";
import { UserContext } from "./context/UserContext";
import Top100 from "./Pages/Top100";
import Navbar from "./components/Navbar";
import Test from "./Pages/Test";
import supabase from "./supabaseClient";

function App() {
  const [albumSelected, isAlbumSelected] = useState(false);
  const [albumData, setAlbumData] = useState({});
  const { setTop100, top100, setUser, user, setSongs } =
    useContext(UserContext);
  const [albumsMainPage, setAlbumsMainPageState] = useState([]);
  const previousRatedAlbums = useRef(null);

  const extractTrackRatings = (albumArray) => {
    const result = [];
    albumArray.forEach(({ key, data }) => {
      const albumInfo = key.replace("tracksRated-", "");
      for (const track in data) {
        if (data.hasOwnProperty(track)) {
          result.push({
            track,
            rating: data[track],
            albumKey: key,
            albumInfo,
          });
        }
      }
    });
    return result;
  };

  const groupSupabaseTop100 = (flatList) => {
    const grouped = {};
    flatList.forEach(({ track, rating, albumKey }) => {
      if (!grouped[albumKey]) {
        grouped[albumKey] = {};
      }
      grouped[albumKey][track] = rating;
    });
    return Object.entries(grouped).map(([key, data]) => ({ key, data }));
  };

  const getRatedAlbumsFromLocalStorage = () => {
    const ratedAlbumsArray = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("tracksRated-")) {
        const value = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(value);
          if (parsed && Object.keys(parsed).length > 0) {
            ratedAlbumsArray.push({ key, data: parsed });
          }
        } catch (e) {
          console.error(`Error parsing localStorage key: ${key}`, e);
        }
      }
    }
    return ratedAlbumsArray;
  };

  const addAlbumsMainPage = (newAlbums) => {
    setAlbumsMainPageState((prevAlbums) => {
      const combinedAlbums = [...prevAlbums];
      newAlbums.forEach((newAlbum) => {
        if (
          !combinedAlbums.find(
            (album) => album.albumData.id === newAlbum.albumData.id
          )
        ) {
          combinedAlbums.push(newAlbum);
        }
      });
      return combinedAlbums;
    });
  };

  const setAlbumsMainPageDirectly = (albumsArray) => {
    setAlbumsMainPageState(albumsArray || []);
  };

  useEffect(() => {
    const updateChangedSongs = async () => {
      const ratedAlbumsArray = getRatedAlbumsFromLocalStorage();
      setSongs(ratedAlbumsArray);

      if (!user?.id) return;

      if (previousRatedAlbums.current === null) {
        const { data, error } = await supabase
          .from("Accounts")
          .select("top100songs")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          console.error("Error fetching top100songs before update:", error);
          return;
        }

        previousRatedAlbums.current = groupSupabaseTop100(
          data.top100songs || []
        );
      }

      const prev = previousRatedAlbums.current.filter(
        (item) => item.data && Object.keys(item.data).length > 0
      );
      const current = ratedAlbumsArray.filter(
        (item) => item.data && Object.keys(item.data).length > 0
      );

      const prevMap = Object.fromEntries(
        prev.map((item) => [item.key, item.data])
      );
      const currentMap = Object.fromEntries(
        current.map((item) => [item.key, item.data])
      );

      const changesToUpdate = current.filter(
        (item) =>
          !prevMap[item.key] ||
          JSON.stringify(prevMap[item.key]) !== JSON.stringify(item.data)
      );

      const removedKeys = prev
        .filter((item) => !currentMap[item.key])
        .map((item) => item.key);

      if (changesToUpdate.length === 0 && removedKeys.length === 0) return;

      const updatedTop100 = extractTrackRatings(current);

      const { data: supabaseData, error: fetchError } = await supabase
        .from("Accounts")
        .select("top100songs")
        .eq("id", user.id)
        .single();

      if (fetchError || !supabaseData) {
        console.error("Error fetching top100songs before update:", fetchError);
        return;
      }

      const existing = supabaseData.top100songs || [];

      const merged = [...existing];

      updatedTop100.forEach((newItem) => {
        const exists = existing.find(
          (oldItem) =>
            oldItem.track === newItem.track &&
            oldItem.albumKey === newItem.albumKey
        );

        if (!exists) {
          merged.push(newItem);
        }
      });

      const { error: updateError } = await supabase
        .from("Accounts")
        .update({ top100songs: merged })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating top100songs:", updateError);
      } else {
        previousRatedAlbums.current = groupSupabaseTop100(merged);
      }
    };

    updateChangedSongs();
  }, [albumsMainPage, user?.id]);

  useEffect(() => {
    async function GetUser() {
      const storedSessionName = "sb-talmzswbtzwycpmgdfzb-auth-token";
      const storedSession = localStorage.getItem(storedSessionName);
      if (!storedSession) return;

      const { data, error } = await supabase.auth.setSession(
        JSON.parse(storedSession)
      );

      if (error) {
        console.error("Error setting session:", error.message || error);
        return;
      }

      const { user } = data;

      if (user) {
        const { data: accountsData, error: accountsError } = await supabase
          .from("Accounts")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (accountsError) {
          console.error(
            "Error fetching account data:",
            accountsError.message || accountsError
          );
          return;
        }

        setUser({ aud: user.aud, ...accountsData });
        setTop100(accountsData.top100);
        setAlbumsMainPageDirectly(accountsData.albums || []);
      } else {
        console.warn("User object is missing after setSession.");
      }
    }

    GetUser();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-accounts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Accounts",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.new?.top100) {
            setTop100(payload.new.top100);
          }
          if (payload.new?.albums) {
            setAlbumsMainPageDirectly(payload.new.albums);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, top100]);

  return (
    <div>
      <AlbumSearchProvider>
        <BrowserRouter>
          <Navbar
            isAlbumSelected={isAlbumSelected}
            setAlbumData={setAlbumData}
            setAlbumsMainPage={addAlbumsMainPage}
            albumsMainPage={albumsMainPage}
          />
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  albumData={albumData}
                  isAlbumSelected={isAlbumSelected}
                  setAlbumData={setAlbumData}
                  albumSelected={albumSelected}
                  setAlbumsMainPage={addAlbumsMainPage}
                  albumsMainPage={albumsMainPage}
                />
              }
            />
            <Route path="/form" element={<Form />} />
            <Route
              path="/top100"
              element={
                <Top100
                  isAlbumSelected={isAlbumSelected}
                  setAlbumData={setAlbumData}
                />
              }
            />
            <Route path="/test" element={<Test />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </AlbumSearchProvider>
    </div>
  );
}

export default App;
