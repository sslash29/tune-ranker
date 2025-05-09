import { useNavigate } from "react-router-dom";

function AlbumTop100({
  album,
  handleAlbumClick,
  index,
  handleChangePosition,
  albumsPosition,
  edit,
  setEdit,
  albumIndex,
  isAlbumSelected,
  setAlbumData,
}) {
  const navigate = useNavigate();

  const handleOnImgClick = () => {
    isAlbumSelected(true);
    setAlbumData(album.albumData);
    navigate("/");
  };

  return (
    <div className="flex items-center gap-5">
      <img
        src={album?.albumData?.images?.[1]?.url || ""}
        alt="img"
        className="w-[174px] h-[174px] cursor-pointer"
        onDoubleClick={handleOnImgClick}
      />
      <li
        className="text-2xl cursor-pointer"
        onClick={() => handleAlbumClick(index)}
      >
        {album?.albumData?.name}
      </li>

      {albumIndex === index && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePosition(albumIndex);
          }}
          className="flex gap-5"
        >
          <input
            type="number"
            min="1"
            max={albumsPosition?.length}
            value={edit}
            onChange={(e) => setEdit(e.target.value)}
            placeholder="Enter position (1-based)"
            className="w-[250px] p-2"
          />
          <button
            type="submit"
            className="p-2.5 px-10 bg-blue-500 text-white rounded hover:scale-105 transition-all"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default AlbumTop100;
