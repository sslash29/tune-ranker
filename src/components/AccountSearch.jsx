import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { UserContext } from "../context/UserContext";

function AccountSearch({ user, isAccountSelected }) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const { setViewedUser } = useContext(UserContext);

  function handleAccountSearchClick() {
    setShouldFetch(false);
    isAccountSelected(true);
    setViewedUser(user);
  }

  return (
    <div
      className="bg-[#333] p-2 rounded hover:bg-[#444] transition cursor-pointer flex items-center gap-3.5"
      onClick={handleAccountSearchClick}
    >
      <img
        src={user.avatarUrl || "/fallback-avatar.png"}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover mt-2"
      />
      <p className="text-lg font-bold">{user.username}</p>
    </div>
  );
}

export default AccountSearch;
