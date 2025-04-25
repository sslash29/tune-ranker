import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function UserProfile() {
  const { user, isSignUp } = useContext(UserContext);

  return (
    <>
      <Link
        to={isSignUp ? "/account" : "/form"}
        style={{ textDecoration: "none", color: "black", marginBottom: "20px" }}
      >
        <div id="user-profile-container" style={{ width: "fit-content" }}>
          <p>{user?.name || "Guest"}</p>
        </div>
      </Link>
    </>
  );
}

export default UserProfile;
