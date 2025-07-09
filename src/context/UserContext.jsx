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
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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

  const getFollowCounts = async () => {
    const uuid = viewedUserId ? viewedUser?.user_uuid : user?.user_uuid;
    if (!uuid) return;

    // Get number of people following this user
    const { count: followers, error: followersError } = await supabase
      .from("following")
      .select("*", { count: "exact", head: true })
      .eq("following_id", uuid);

    // Get number of people this user is following
    const { count: following, error: followingError } = await supabase
      .from("following")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", uuid);

    if (followersError || followingError) {
      console.error(
        "Error fetching follow counts:",
        followersError || followingError
      );
      return;
    }

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const getViewedUserData = async () => {
    const idToUse = viewedUser?.id || user?.id;
    if (!idToUse) return;

    const { data, error } = await supabase
      .from("Accounts")
      .select("username, created_at, avatar_url,user_uuid")
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
      user_uuid: data.user_uuid,
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
      getFollowCounts();
    }
  }, [viewedUser?.id, user?.id]);

  const isViewingOwnProfile = !viewedUser?.id || viewedUser.id === user.id;
  console.log(
    `viewedUser = ${viewedUser?.id} user_id = ${user.id} isViewingOwnProfile=${isViewingOwnProfile}`
  );
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
        followersCount,
        followingCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
