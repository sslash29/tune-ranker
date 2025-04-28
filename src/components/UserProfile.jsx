import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function UserProfile() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Link
        to={user.aud ? "/account" : "/form"}
        style={{ textDecoration: "none", color: "black", marginBottom: "20px" }}
      >
        <div id="user-profile-container" style={{ width: "fit-content" }}>
          <p>{user?.email || "Guest"}</p>
        </div>
      </Link>
    </>
  );
}

export default UserProfile;
