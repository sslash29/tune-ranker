function AlbumsMainPage({ albumsMainPage, isAlbumSelected, setAlbumData }) {
  function handleAlbumClick(data) {
    isAlbumSelected(true);
    setAlbumData(data);
  }

  return (
    <div>
      <p style={{ marginLeft: "2rem" }}>
        you have listened to {albumsMainPage?.length} 💿
      </p>
      <div className="albums-main-page">
        {albumsMainPage?.map((album, index) => {
          const albumData = album.data || album.albumData; // Fallback to albumData if data is missing

          if (!albumData || !albumData.image) {
            console.warn("Album data is missing or incorrect:", album);
            return null; // Skip rendering invalid albums
          }

          return (
            <div
              key={index}
              className="album-main"
              onClick={() => handleAlbumClick(albumData)}
            >
              <img src={albumData.image[3]?.["#text"] || ""} alt="album" />
              <h4>{album.rating}/5</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlbumsMainPage;
