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
    <div className="album" onClick={() => handleAlbumClick(index)} key={index}>
      <img src={album?.albumData?.image[2]["#text"]} alt="img" />
      <li>{album?.albumData?.name}</li>
      {albumIndex === index && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePosition(albumIndex);
          }}
        >
          <input
            type="number"
            min="1"
            max={albumsPosition?.length}
            value={edit}
            onChange={(e) => setEdit(e.target.value)}
            placeholder="enter position (1-based)"
          />
          <button type="submit">submit</button>
        </form>
      )}
    </div>
  );
}

export default AlbumTop100;
