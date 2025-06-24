import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { motion } from "motion/react";
function UserProfile() {
  const { user } = useContext(UserContext);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      className="bg-[#2A2A2A] p-3 py-2 rounded-3xl px-5"
    >
      <Link
        to={user.aud ? "/account" : "/form"} // used the aud(authenticated) because the only way for the user log out if he's already in
      >
        <div id="user-profile-container">
          <p>{user?.email?.slice(0, 10) || "Guest"}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default UserProfile;
