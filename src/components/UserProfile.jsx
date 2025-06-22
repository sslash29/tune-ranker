import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function UserProfile() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Link
        to={user.aud ? "/account" : "/form"} // used the aud(authenticated) because the only way for the user log out if he's already in
        style={{ textDecoration: "none", color: "white", marginBottom: "20px" }}
      >
        <div id="user-profile-container" style={{ width: "fit-content" }}>
          <p>{user?.email || "Guest"}</p>
        </div>
      </Link>
    </>
  );
}

export default UserProfile;
