import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";
import { useNavigate } from "react-router-dom";

function AlbumSearch({
  name,
  img,
  favAlbumImg,
  artist,
  data,
  isAlbumSelected,
  setAlbumData,
  onSelect,
}) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  const navigate = useNavigate();
  function handleAlbumSearchClick() {
    isAlbumSelected(true);
    setAlbumData(data);
    setShouldFetch(false);
    onSelect?.({ name, favAlbumImg });
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
