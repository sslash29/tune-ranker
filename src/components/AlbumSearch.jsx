import { useContext } from "react";
import { AlbumSearchContext } from "../context/AlbumSearchContext";

function AlbumSearch({
  name,
  img,
  favAlbumImg,
  artist,
  data,
  isAlbumSelected,
  setAlbumData,
  onSelect,
  setActiveSection,
}) {
  const { setShouldFetch } = useContext(AlbumSearchContext);
  function handleAlbumSearchClick() {
    isAlbumSelected(true);
    setAlbumData(data);
    setShouldFetch(false);
    setActiveSection(null);
    onSelect?.({ name, favAlbumImg });
  }
  return (
    <div className="flex gap-2" onClick={() => handleAlbumSearchClick()}>
      <img src={img} alt="img" />
      <div className="metadata">
        <h5>{name}</h5>
        <p>{artist}</p>
      </div>
    </div>
  );
}

export default AlbumSearch;
