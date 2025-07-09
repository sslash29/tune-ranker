import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import DisplayAlbums from "../components/DisplayAlbums";
import TabComponent from "../components/TabComponent";

function UserAccount() {
  const navigate = useNavigate();
  const {
    albumsRated,
    albumsThisYear,
    user,
    top100,
    followersCount,
    followingCount,
  } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: user.username,
    dateJoined: user.created_at,
    avatar: user.avatar_url,
  });
  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState("");
  const [display, setDisplay] = useState("favorite-albums");
  console.dir(user);
  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogOut = () => {
    const storedSessionName = "sb-talmzswbtzwycpmgdfzb-auth-token";
    localStorage.setItem(storedSessionName, "");
    navigate("/");
  };

  const handleUpdate = async () => {
    setError("");
    if (!user?.id) return;

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
    }
  };

  if (!user?.id) return null;

  // ✅ Show message if no albums rated
  if (!top100 || Object.keys(top100).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to your profile!
        </h2>
        <p className="text-lg mb-4 text-gray-600">
          You need to
          <span className="font-semibold text-blue-500">rate an album</span>
          before you can view your account stats.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Go Rate an Album
        </button>
      </div>
    );
  }

  return (
    <div className="account">
      <div className="p-10 px-20 flex flex-col gap-15">
        <div className="flex justify-between w-[1125px]">
          <div className="flex gap-8 items-center">
            {user.avatar_url !== "nopfp.jpg" && user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="profile-picture"
                className="w-[180px] h-[180px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-full bg-gray-300 animate-pulse" />
            )}

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
                <div className="flex gap items-center">
                  <h2 className="text-4xl font-bold">{userData.username}</h2>
                  {/* <span className="px-4 py-1 bg-blue-400 scale-70 self-baseline-last rounded">
                    PRO
                  </span> */}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">{albumsRated}</p>
                  <p className="text-xs font-light">Albums</p>
                </div>
                <img src="/SmallPipe.svg" alt="pipe" className="h-[25px]" />
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">{albumsThisYear}</p>
                  <p className="text-xs font-light w-max">This year</p>
                </div>
                <img src="/SmallPipe.svg" alt="pipe" className="h-[25px]" />
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">{followingCount}</p>
                  <p className="text-xs font-light">following</p>
                </div>
                <img src="/SmallPipe.svg" alt="pipe" className="h-[25px]" />
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">{followersCount}</p>
                  <p className="text-xs font-light">Followers</p>
                </div>
              </div>
              <div className="translate-y-3 flex gap-3.5 items-center">
                <button className="bg-white px-3 py-2 rounded-3xl text-black">
                  Edit Profile
                </button>
                <button className="bg-white px-3 py-2 rounded-3xl text-black">
                  Channels
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <TabComponent display={display} setDisplay={setDisplay} />
          <DisplayAlbums display={display} />
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
    </div>
  );
}

export default UserAccount;
