import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  function handleLogOut() {
    const storedSessionName = "sb-talmzswbtzwycpmgdfzb-auth-token";
    localStorage.setItem(storedSessionName, "");
    navigate("/");
  }
  return (
    <div className="p-10 px-20 flex flex-col gap-15">
      <div className="flex justify-between w-[1125px]">
        <div className="flex gap-8 items-center">
          <img
            src="./public/nopfp.jpg"
            alt="profile-picture"
            className="w-[125px] h-[125px] rounded-full"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">ammarrlr</h2>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">106</p>
                <p className=" text-xs font-light">Albums</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">24</p>
                <p className="text-xs font-light">This year</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">84</p>
                <p className="text-xs font-light">Artists</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-5">
            <p>Date Joined: 2017</p>
            <p>Favorite genre: hip-hop</p>
            <p>Favorite Artist: Frank Ocean</p>
          </div>
        </div>
      </div>

      <div>
        <h3>Favorite Albums</h3>
        <hr />
        <div className="flex justify-between w-[1280px]">
          <div className="w-[200px] h-[200px]">
            <img src="" alt="album" />
          </div>
          <div className="w-[200px] h-[200px]">
            <img src="" alt="album" />
          </div>
          <div className="w-[200px] h-[200px]">
            <img src="" alt="album" />
          </div>
          <div className="w-[200px] h-[200px]">
            <img src="" alt="album" />
          </div>
        </div>
      </div>
      {/* <button
        onClick={() => handleLogOut()}
        className=" bg-red-400 px-2 py-3 rounded hover:scale-105 "
      >
        Log out
      </button> */}
    </div>
  );
}

export default Account;
