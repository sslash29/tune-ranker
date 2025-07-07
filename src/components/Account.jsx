import { useContext, useState } from "react";
import TabComponent from "../components/TabComponent";
import DisplayAlbums from "../components/DisplayAlbums";
import { UserContext } from "../context/UserContext";

function Account({ user }) {
  const [display, setDisplay] = useState("favorite-albums");
  const { albumsRated, albumsThisYear } = useContext(UserContext);
  return (
    <div className="account">
      <div className="p-10 px-20 flex flex-col gap-15">
        <div className="flex justify-between w-[1125px]">
          <div className="flex gap-8 items-center">
            <img
              src="./public/nopfp.jpg"
              alt="profile-picture"
              className="w-[180px] h-[180px] rounded-full"
            />
            <div className="flex flex-col gap-2">
              <div className="flex gap items-center">
                <h2 className="text-4xl font-bold">{user.username}</h2>
                <span className="px-4 py-1 bg-blue-400 scale-70 self-baseline-last rounded">
                  PRO
                </span>
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
                  <p className="text-lg font-semibold">25</p>
                  <p className="text-xs font-light">Following</p>
                </div>
                <img src="/SmallPipe.svg" alt="pipe" className="h-[25px]" />
                <div className="flex flex-col items-center opacity-60">
                  <p className="text-lg font-semibold">10,900</p>
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
          <button className="bg-blue-500 px-4 py-3 rounded text-white hover:scale-105">
            Edit
          </button>
          <button className="bg-red-400 px-4 py-3 rounded text-white hover:scale-105">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
