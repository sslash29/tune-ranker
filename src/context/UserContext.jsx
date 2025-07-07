import { useState, createContext, useEffect } from "react";
import supabase from "../supabaseClient"; // Make sure your client is imported

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [top100, setTop100] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [songs, setSongs] = useState({});
  const [albumsThisYear, setAlbumsThisYear] = useState(0);
  const albumsRated = top100 ? Object.keys(top100).length : 0;

  const getAlbumStats = async () => {
    if (!user?.id) return;

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1).getTime();

    const { data, error } = await supabase
      .from("Accounts")
      .select("albums")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching albums:", error);
      return;
    }

    const albums = Array.isArray(data?.albums) ? data.albums : [];

    const albumsThisYear = albums.filter(
      (album) => album?.addedAt && album.addedAt >= yearStart
    );
    setAlbumsThisYear(albumsThisYear.length);
  };

  const getUserData = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("Accounts")
      .select("username, created_at, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    let avatarUrl = null;

    if (data?.avatar_url) {
      const { data: publicData } = supabase.storage
        .from("avatar")
        .getPublicUrl(data.avatar_url);
      avatarUrl = publicData?.publicUrl || null;
    }

    setUser((prev) => ({
      ...prev,
      username: data.username,
      created_at: data.created_at,
      avatar_url: avatarUrl,
    }));
  };

  useEffect(() => {
    if (user?.id) {
      getUserData();
      getAlbumStats();
    }
  }, [user?.id]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        top100,
        setTop100,
        isSignUp,
        setIsSignUp,
        songs,
        setSongs,
        albumsRated,
        albumsThisYear,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
