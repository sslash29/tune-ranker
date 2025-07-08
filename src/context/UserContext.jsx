// context/UserContext.js
import { useState, createContext, useEffect } from "react";
import supabase from "../supabaseClient";
import { useParams } from "react-router-dom";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [viewedUser, setViewedUser] = useState({});
  const [viewedUserId, setViewedUserId] = useState(null);
  const [top100, setTop100] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [songs, setSongs] = useState({});
  const [albumsThisYear, setAlbumsThisYear] = useState(0);
  const [albumsRated, setAlbumsRated] = useState(0);

  const getAlbumStats = async () => {
    const idToUse = viewedUserId ? viewedUserId : user.id;
    if (!idToUse) return;

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1).getTime();

    const { data, error } = await supabase
      .from("Accounts")
      .select("albums,top100")
      .eq("id", idToUse)
      .single();

    setAlbumsRated(data?.top100 ? Object.keys(data?.top100).length : 0);
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

  const getViewedUserData = async () => {
    const idToUse = viewedUser?.id || user?.id;
    if (!idToUse) return;

    const { data, error } = await supabase
      .from("Accounts")
      .select("username, created_at, avatar_url")
      .eq("id", idToUse)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    let avatarUrl = null;

    if (data?.avatar_url) {
      const { data: publicData, error: urlError } = supabase.storage
        .from("avatar")
        .getPublicUrl(data.avatar_url);
      if (urlError) console.error("Error getting public URL:", urlError);

      avatarUrl = publicData?.publicUrl || null;
    }

    const userData = {
      username: data.username,
      created_at: data.created_at,
      avatar_url: avatarUrl,
    };

    if (viewedUserId) {
      setViewedUser((prev) => ({ ...prev, ...userData }));
    } else {
      setUser((prev) => ({ ...prev, ...userData }));
    }
  };

  useEffect(() => {
    if (viewedUser?.id || user?.id) {
      getViewedUserData();
      getAlbumStats();
    }
  }, [viewedUser?.id, user?.id]);

  const isViewingOwnProfile = !viewedUser?.id || viewedUser.id === user.id;
  const profile = isViewingOwnProfile ? user : viewedUser;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        viewedUser,
        setViewedUser,
        top100,
        setTop100,
        isSignUp,
        setIsSignUp,
        songs,
        setSongs,
        albumsRated,
        albumsThisYear,
        profile,
        isViewingOwnProfile,
        viewedUserId,
        setViewedUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
