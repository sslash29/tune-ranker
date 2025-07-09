import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function AccountSearch({ user }) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const { setViewedUserId, user: loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleAccountSearchClick() {
    setShouldFetch(false);

    // If user clicked on their own account
    if (user.id === loggedInUser.id) {
      navigate("/account");
      setViewedUserId(null); // Clear viewed user
    } else {
      setViewedUserId(user.id); // Set clicked user's ID
      navigate(`/user/${user.id}`);
    }
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
