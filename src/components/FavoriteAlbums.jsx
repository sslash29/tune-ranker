import AlbumFavorites from "./AlbumFavorites";

function FavoriteAlbums() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Favorite Albums</h3>
      <hr className="my-2" />
      <div className="flex justify-between w-[1280px]">
        <AlbumFavorites />
        <AlbumFavorites />
        <AlbumFavorites />
        <AlbumFavorites />
      </div>
    </div>
  );
}

export default FavoriteAlbums;
