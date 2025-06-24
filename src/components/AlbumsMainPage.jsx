import { AnimatePresence, motion } from "motion/react";

function AlbumsMainPage({
  albumsMainPage,
  isAlbumSelected,
  setAlbumData,
  isShowRating,
}) {
  function handleAlbumClick(data) {
    isAlbumSelected(true);
    setAlbumData(data);
  }
  console.log(albumsMainPage);

  return (
    <div className="mt-5">
      <div className="flex p-5 px-10 gap-7 flex-wrap">
        <AnimatePresence>
          {albumsMainPage?.map((album, index) => {
            const albumData = album.albumData; // <- correct path now

            if (!albumData || !albumData.images) {
              console.warn("Album data is missing or incorrect:", album);
              return null;
            }

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-1.5"
                onClick={() => handleAlbumClick(albumData)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={albumData.images[1]?.url || ""}
                  alt="album"
                  className="rounded-xl"
                />
                {isShowRating ? <h4>{album.rating}/5</h4> : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AlbumsMainPage;
