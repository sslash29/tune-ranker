import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserContext } from "../context/UserContext";
function Logo({ isAlbumSelected, setActiveSection }) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const { setViewedUser } = useContext(UserContext);
  const navigate = useNavigate();
  function handleLogoClick() {
    isAlbumSelected(false);
    setShouldFetch(false);
    setActiveSection(null);
    setViewedUser({});
    navigate("/");
  }
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
    >
      <h3 className="text-4xl" onClick={() => handleLogoClick()}>
        channel.fm
      </h3>
    </motion.div>
  );
}

export default Logo;
