import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { useNavigate } from "react-router-dom";

function Logo({ isAlbumSelected }) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const navigate = useNavigate();
  function handleLogoClick() {
    isAlbumSelected(false);
    setShouldFetch(false);
    navigate("/");
  }
  return (
    <div id="logo-container">
      <h3 id="logo" onClick={() => handleLogoClick()}>
        Tune Ranker
      </h3>
    </div>
  );
}

export default Logo;
