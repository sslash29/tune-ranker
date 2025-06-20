import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import FavoriteAlbums from "../components/FavoriteAlbums";
import RecentActivity from "../components/RecentActivit";

// 🔹 Helper: Count unique artist names
const getUniqueArtistCount = (albums) => {
  const artistNames = albums.map((album) =>
    album.albumData?.name?.toLowerCase().trim()
  );
  const uniqueArtists = new Set(artistNames.filter(Boolean));
  return uniqueArtists.size;
};

function Account() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    favoriteGenre: "",
    favoriteArtist: "",
    dateJoined: "",
  });
  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState("");
  const [albumsThisYear, setAlbumsThisYear] = useState(0);
  const [uniqueArtists, setUniqueArtists] = useState(0);
  const { user, top100 } = useContext(UserContext);
  const albumsRated = Object.keys(top100).length;

  if (user.id === undefined) navigate("/");

  const handleLogOut = () => {
    const storedSessionName = "sb-talmzswbtzwycpmgdfzb-auth-token";
    localStorage.setItem(storedSessionName, "");
    navigate("/");
  };

  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("Accounts")
        .select("username, favoritegenere, favoriteartist, created_at")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      if (data) {
        setUserData({
          username: data.username || "none",
          favoriteGenre: data.favoritegenere || "none",
          favoriteArtist: data.favoriteartist || "none",
          dateJoined: data.created_at,
        });
        setFormData({
          username: data.username || "",
          favoriteGenre: data.favoritegenere || "",
          favoriteArtist: data.favoriteartist || "",
          dateJoined: data.created_at,
        });
      }
    }
  };

  // 🔹 Fetch stats for this year + unique artists
  const getAlbumStats = async () => {
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

    const albums = data.albums || [];

    const albumsThisYear = albums.filter((album) => album.addedAt >= yearStart);
    setAlbumsThisYear(albumsThisYear.length);

    const uniqueArtistCount = getUniqueArtistCount(albums);
    setUniqueArtists(uniqueArtistCount);
  };

  const handleUpdate = async () => {
    setError("");

    const { error: updateError } = await supabase
      .from("Accounts")
      .update({
        username: formData.username,
        favoritegenere: formData.favoriteGenre,
        favoriteartist: formData.favoriteArtist,
      })
      .eq("id", user.id);

    if (updateError) {
      if (updateError.message.includes("duplicate key")) {
        setError("Username already in use.");
      } else {
        setError("Failed to update. Please try again.");
      }
    } else {
      setEditMode(false);
      fetchUserData(); // refresh with updated data
    }
  };

  useEffect(() => {
    fetchUserData();
    getAlbumStats();
  }, [user?.id]);

  return (
    <>
      <div className="p-10 px-20 flex flex-col gap-15">
        <div className="flex justify-between w-[1125px]">
          <div className="flex gap-8 items-center">
            <img
              src="./public/nopfp.jpg"
              alt="profile-picture"
              className="w-[125px] h-[125px] rounded-full"
            />
            <div className="flex flex-col gap-2">
              {editMode ? (
                <label>
                  Username:
                  <input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="border p-1 ml-2"
                  />
                </label>
              ) : (
                <h2 className="text-2xl font-bold">{userData.username}</h2>
              )}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold">{albumsRated}</p>
                  <p className="text-xs font-light">Albums</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold">{albumsThisYear}</p>
                  <p className="text-xs font-light">This year</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold">{uniqueArtists}</p>
                  <p className="text-xs font-light">Artists</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {editMode ? (
              <div className="flex flex-col gap-5">
                <label>
                  Favorite Genre:
                  <input
                    value={formData.favoriteGenre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        favoriteGenre: e.target.value,
                      })
                    }
                    className="border p-1 ml-2"
                  />
                </label>
                <label>
                  Favorite Artist:
                  <input
                    value={formData.favoriteArtist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        favoriteArtist: e.target.value,
                      })
                    }
                    className="border p-1 ml-2"
                  />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 px-3 py-2 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 px-3 py-2 rounded text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <p>Date Joined: {userData.dateJoined.split("-")[0]}</p>
                <p>Favorite genre: {userData.favoriteGenre}</p>
                <p>Favorite Artist: {userData.favoriteArtist}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <FavoriteAlbums editMode={editMode} />
        </div>

        <div className="mt-10">
          <RecentActivity />
        </div>

        <div className="mt-16 flex gap-4">
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 px-4 py-3 rounded text-white hover:scale-105"
          >
            Edit
          </button>
          <button
            onClick={handleLogOut}
            className="bg-red-400 px-4 py-3 rounded text-white hover:scale-105"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default Account;
