import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { useNavigate } from "react-router-dom";

function AlbumSearch({
  name,
  img,
  artist,
  data,
  isAlbumSelected,
  setAlbumData,
}) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const navigate = useNavigate();
  function handleAlbumSearchClick() {
    navigate("/");
    isAlbumSelected(true);
    setAlbumData(data);
    setShouldFetch(false);
  }
  return (
    <div className="album-search" onClick={() => handleAlbumSearchClick()}>
      <img src={img} alt="img" />
      <div className="metadata">
        <h5>{name}</h5>
        <p>{artist}</p>
      </div>
    </div>
  );
}

export default AlbumSearch;
