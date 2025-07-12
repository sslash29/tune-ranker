import { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import { AlbumSearchProvider } from "./context/AlbumSearchContext";
import Form from "./Pages/Form";
import { UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import supabase from "./supabaseClient";
import UserAccount from "./Pages/UserAccount";
import Account from "./components/PublicAccount";
import UserProfileRoute from "./components/UserProfileRoute";

function App() {
  const [albumSelected, isAlbumSelected] = useState(false);
  // const [accountSelected, isAccountSelected] = useState(false);
  const [albumData, setAlbumData] = useState({});
  const { setTop100, top100, setUser, user, setSongs } =
    useContext(UserContext);
  const [albumsMainPage, setAlbumsMainPageState] = useState([]);
  const previousRatedAlbums = useRef(null);
  const [activeSection, setActiveSection] = useState(null);

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
    async function GetUser() {
      console.log("effect running");
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
      console.log(data);

      if (user) {
        const { data: accountsData, error: accountsError } = await supabase
          .from("Accounts")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (accountsError) {
          console.dir(user);
          console.error(
            "Error fetching account data:",
            accountsError.message || accountsError
          );
          return;
        }

        setUser({ aud: user.aud, ...accountsData });
        setTop100(accountsData.top100);
        setAlbumsMainPageDirectly(accountsData.albums || []);
        previousRatedAlbums.current = groupSupabaseTop100(
          accountsData.top100songs || []
        );
        setSongs(previousRatedAlbums.current);
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
    <div className="flex flex-col gap-5">
      <AlbumSearchProvider>
        <BrowserRouter>
          <Navbar
            isAlbumSelected={isAlbumSelected}
            setAlbumData={setAlbumData}
            setAlbumsMainPage={addAlbumsMainPage}
            albumsMainPage={albumsMainPage}
            setActiveSection={setActiveSection}
            // isAccountSelected={isAccountSelected}
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
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  // accountSelected={accountSelected}
                />
              }
            />
            <Route path="/form" element={<Form />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/user/:id" element={<UserProfileRoute />} />
          </Routes>
        </BrowserRouter>
      </AlbumSearchProvider>
    </div>
  );
}

export default App;
