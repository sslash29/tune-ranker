import Album from "../components/Album";
import AlbumsMainPage from "../components/AlbumsMainPage";

function HomePage({
  isAlbumSelected,
  setAlbumData,
  albumSelected,
  albumData,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  return (
    <div>
      {albumSelected ? (
        <>
          <Album
            albumData={albumData}
            isAlbumSelected={isAlbumSelected}
            setAlbumsMainPage={setAlbumsMainPage}
            albumsMainPage={albumsMainPage}
          />
        </>
      ) : (
        <>
          <AlbumsMainPage
            albumsMainPage={albumsMainPage}
            isAlbumSelected={isAlbumSelected}
            setAlbumData={setAlbumData}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
