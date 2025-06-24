function AlbumsMainPage({ albumsMainPage, isAlbumSelected, setAlbumData }) {
  function handleAlbumClick(data) {
    isAlbumSelected(true);
    setAlbumData(data);
  }
  console.log(albumsMainPage);

  return (
    <div>
      <p style={{ marginLeft: "2rem" }}>
        you have listened to {albumsMainPage?.length} 💿
      </p>
      <div className="albums-main-page">
        {albumsMainPage?.map((album, index) => {
          const albumData = album.albumData; // <- correct path now

          if (!albumData || !albumData.images) {
            console.warn("Album data is missing or incorrect:", album);
            return null;
          }

          return (
            <div
              key={index}
              className="album-main"
              onClick={() => handleAlbumClick(albumData)}
            >
              <img src={albumData.images[1]?.url || ""} alt="album" />
              <h4>{album.rating}/5</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlbumsMainPage;
