import { useContext, useEffect, useState } from "react";
import capitalizeWords from "../helpers/capatalize";
import StarRate from "./StarRate";
import TracksRated from "./TracksRated";
import { AnimatePresence, motion } from "motion/react";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

function AlbumLog({
  albumData,
  tracks,
  setIsAlbumLog,
  setIsAlbumSelected,
  albumsMainPage,
  setAlbumsMainPage,
}) {
  const [commentValue, setCommentValue] = useState("");
  const [rating, setRating] = useState(0);
  const [isMore, setIsMore] = useState(false);
  const { user } = useContext(UserContext);
  let artists = [];

  useEffect(() => {
    async function fetchAlbumData() {
      const { data, error } = await supabase
        .from("Accounts")
        .select("albums")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching albums:", error);
        return;
      }

      const albums = data?.albums || [];
      const foundAlbum = albums.find(
        (album) => album.albumData?.id === albumData.id
      );

      if (foundAlbum) {
        setRating(foundAlbum.rating || 0);
        setCommentValue(foundAlbum.review || "");
      }
    }

    fetchAlbumData();
  }, [albumData.id, user.id]);

  async function handleDelete(name, artists) {
    const updatedAlbums = albumsMainPage.filter(
      (album) => album.albumData.name !== name
    );

    const { data: userData, error: fetchError } = await supabase
      .from("Accounts")
      .select("top100")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching top100 for deletion:", fetchError);
      return;
    }

    const updatedTop100 = (userData.top100 || []).filter(
      (album) => (album.albumData || album.data)?.name !== name
    );

    const { error: updateError } = await supabase
      .from("Accounts")
      .update({
        albums: updatedAlbums,
        top100: updatedTop100,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating after delete:", updateError);
    }

    setIsAlbumSelected(false);
  }

  async function handleSave() {
    const newAlbum = {
      rating,
      albumData,
      addedAt: Date.now(),
      review: commentValue,
    };

    const updatedAlbums = [
      ...albumsMainPage.filter((album) => album.albumData?.id !== albumData.id),
      newAlbum,
    ];

    setAlbumsMainPage(updatedAlbums);
    setIsAlbumSelected(false);

    const { data: userData, error: fetchError } = await supabase
      .from("Accounts")
      .select("top100")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching top100 albums:", fetchError);
      return;
    }

    const updatedTop100Albums = [
      ...userData.top100.filter(
        (album) => album.albumData?.id !== albumData.id
      ),
      newAlbum,
    ];

    const { error: albumsError } = await supabase
      .from("Accounts")
      .update({
        albums: updatedAlbums,
        top100: updatedTop100Albums,
      })
      .eq("id", user.id);

    if (albumsError) console.error("Error updating albums:", albumsError);
  }

  return (
    <div className="bg-[#191919] p-7 flex text-white justify-center gap-10 relative">
      <div>
        <img
          src={albumData.images?.[1].url}
          alt="album"
          className="hover:scale-105 transition-all ease-linear"
        />
      </div>
      <div className="flex flex-col ">
        <div className="flex items-center justify-between">
          <p className="text-4xl">{capitalizeWords(albumData.name)}</p>
          <StarRate rating={rating} setRating={setRating} />
        </div>
        <div className="flex items-center gap-2">
          {albumData.artists.map((artist, index) => {
            artists.push(artist);
            return (
              <p className="text-white opacity-50 text-lg" key={artist.id}>
                {artist.name}
                {index < albumData.artists.length - 1 && <span>,&nbsp;</span>}
              </p>
            );
          })}
          <img src="dot.svg" alt="dot" className="translate-x-1" />
          <p className="opacity-50 text-lg">
            {albumData.total_tracks || "unknown"} tracks
          </p>
        </div>
        <textarea
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          placeholder="Add a Review..."
          className="bg-[#252525] rounded-lg h-[215px] p-2 mt-4 resize-none outline-0"
        />
        <div>
          <TracksRated
            tracks={tracks}
            albumName={albumData.name}
            artists={artists}
          />
        </div>
      </div>

      <button onClick={() => setIsMore((more) => !more)}>
        <img src="More.svg" alt="more" className="fixed bottom-5 right-20" />
      </button>

      <AnimatePresence>
        {isMore && (
          <motion.div
            key="more-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-5 bg-[#252525] flex flex-col p-5 rounded-4xl gap-2"
          >
            <button onClick={handleSave} className="hover:scale-90">
              Save Rating
            </button>
            <button
              onClick={() => setIsAlbumLog(false)}
              className="hover:scale-90"
            >
              Cancel Rating
            </button>
            <button
              onClick={() => handleDelete(albumData.name, albumData.artists)}
              className="hover:scale-90"
            >
              Delete Album
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AlbumLog;
