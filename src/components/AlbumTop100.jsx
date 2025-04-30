function AlbumTop100({
  album,
  handleAlbumClick,
  index,
  handleChangePosition,
  albumsPosition,
  edit,
  setEdit,
  albumIndex,
}) {
  return (
    <div
      className="flex items-center gap-5 "
      onClick={() => handleAlbumClick(index)}
      key={index}
    >
      <img
        src={album?.albumData?.image[2]["#text"]}
        alt="img"
        className="w-[174px] h-[174px]"
      />
      <li className="text-2xl">{album?.albumData?.name}</li>
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
            placeholder="enter position (1-based)"
            className="w-[250px] p-2"
          />
          <button
            type="submit"
            className="p-2.5 px-10 bg-blue-500 text-white rounded hover:scale-105 transition-all"
          >
            submit
          </button>
        </form>
      )}
    </div>
  );
}

export default AlbumTop100;
