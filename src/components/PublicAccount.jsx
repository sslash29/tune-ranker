import { useContext, useEffect, useState } from "react";
import TabComponent from "./TabComponent";
import DisplayAlbums from "./DisplayAlbums";
import { UserContext } from "../context/UserContext";
import supabase from "../supabaseClient";

function Account() {
  const [display, setDisplay] = useState("favorite-albums");
  const [isFollowing, setIsFollowing] = useState(false);
  const [canFollow, setCanFollow] = useState(false);

  const {
    albumsRated,
    albumsThisYear,
    viewedUser,
    user,
    followersCount,
    followingCount,
  } = useContext(UserContext);
  useEffect(() => {
    async function checkFollow() {
      if (!user?.user_uuid || !viewedUser?.user_uuid) {
        console.warn("UUIDs not loaded yet.");
        setCanFollow(false);
        return;
      }

      setCanFollow(true); // ✅ Now UUIDs are present

      const { data, error } = await supabase
        .from("following")
        .select("*")
        .eq("follower_id", user.user_uuid)
        .eq("following_id", viewedUser.user_uuid)
        .maybeSingle();

      if (error) {
        console.error("Follow check error:", error);
      }
      setIsFollowing(data !== null);
    }

    checkFollow();
  }, [user, viewedUser]);

  async function handleFollow() {
    const { error } = await supabase.from("following").insert({
      follower_id: user.user_uuid,
      following_id: viewedUser.user_uuid,
    });

    if (error) console.error(error);

    setIsFollowing(true);
  }

  async function handleUnFollow() {
    const { error } = await supabase
      .from("following")
      .delete()
      .eq("follower_id", user.user_uuid)
      .eq("following_id", viewedUser.user_uuid);

    if (error) {
      console.error("Unfollow error:", error);
    } else {
      setIsFollowing(false);
    }
  }

  return (
    <div className="account">
      <div className="p-10 px-20 flex flex-col gap-15">
        <div className="flex justify-between w-[1125px]">
          <div className="flex gap-8 items-center">
            {viewedUser.avatar_url !== "nopfp.jpg" && viewedUser.avatar_url ? (
              <img
                src={viewedUser.avatar_url}
                alt="profile-picture"
                className="w-[180px] h-[180px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-full bg-gray-300 animate-pulse" />
            )}

            <div className="flex flex-col gap-2">
              <div className="flex gap items-center">
                <h2 className="text-4xl font-bold">{viewedUser.username}</h2>
                {/* <span className="px-4 py-1 bg-blue-400 scale-70 self-baseline-last rounded">
                  PRO
                </span> */}
              </div>

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
                  <p className="text-xs font-light">Following</p>
                </div>
                <img src="/SmallPipe.svg" alt="pipe" className="h-[25px]" />
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">{followersCount}</p>
                  <p className="text-xs font-light">Followers</p>
                </div>
              </div>

              <div className="translate-y-3 flex gap-3.5 items-center">
                {!isFollowing ? (
                  <button
                    disabled={!canFollow}
                    className={`px-3 py-2 rounded-3xl w-full ${
                      canFollow
                        ? "bg-white text-black"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={handleFollow}
                  >
                    {canFollow ? "Follow" : "Loading..."}
                  </button>
                ) : (
                  <button
                    className="border px-3 py-2 rounded-3xl text-white w-full"
                    onClick={handleUnFollow}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <TabComponent display={display} setDisplay={setDisplay} />
          <DisplayAlbums display={display} />
        </div>
      </div>
    </div>
  );
}

export default Account;
