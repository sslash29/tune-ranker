import { useContext, useEffect, useState } from "react";
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
  const { setTop100, top100, setUser, user, setSongs } = useContext(UserContext);

  const [albumsMainPage, setAlbumsMainPage] = useState([]);


useEffect(() => {
  const ratedAlbumsArray = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("tracksRated-")) {
      const value = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(value);
        ratedAlbumsArray.push({
          key,
          data: parsed,
        });
      } catch (e) {
        console.error(`Error parsing localStorage key: ${key}`, e);
      }
    }
  }

  setSongs(ratedAlbumsArray);
}, [albumsMainPage]);

  
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
        return; // Stop here on error
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
          return; // Stop here on error
        }

        console.log("Accounts data:", accountsData);
        setUser({ aud: user.aud, ...accountsData });
        setTop100(accountsData.top100);
        setAlbumsMainPage(accountsData.albums);
      } else {
        console.warn(
          "User object is missing after setSession.  This is unexpected."
        );
        //  Handle the case where user is null/undefined.  Perhaps redirect to login?
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
          console.log("Realtime payload", payload);
          if (payload.new?.top100) {
            setTop100(payload.new.top100);
          }
          if (payload.new?.albums) {
            setAlbumsMainPage(payload.new.albums);
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
            setAlbumsMainPage={setAlbumsMainPage}
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
                  setAlbumsMainPage={setAlbumsMainPage}
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
