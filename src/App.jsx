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
  const { setTop100, top100, setUser } = useContext(UserContext);

  const [albumsMainPage, setAlbumsMainPage] = useState([]);

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
    const top100Channel = supabase
      .channel("realtime-accounts")
      .on(
        "postgres_changes",
        {
          event: "*", // 'INSERT', 'UPDATE', 'DELETE' or '*'
          schema: "public",
          table: "Accounts",
          columns: "top100",
        },
        (payload) => {
          setTop100(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(top100Channel);
    };
  }, [top100]);
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
              element={<Top100 albumData={albumsMainPage} />}
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
