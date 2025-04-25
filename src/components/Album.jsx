import { useContext, useState } from "react";
import StarRate from "./StarRate";
import useFetch from "../hooks/useFetch";
import Tracks from "./Tracks";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";
import Tags from "./Tags";

function Album({
  albumData,
  isAlbumSelected,
  setAlbumsMainPage,
  albumsMainPage,
}) {
  const [rating, setRating] = useState(0);
  const API_KEY = import.meta.env.VITE_API_KEY; // ✅ updated for Vite  console.dir(albumData);
  const { data, error, loading } = useFetch(
    `http://ws.audioscrobbler.com//2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${albumData.artist}&album=${albumData.name}&format=json`
  );
  const { user } = useContext(UserContext);
  if (data) console.dir(data);
  if (error) console.log(error);

  const tracks = data?.album?.tracks?.track;

  async function GetData() {
    const AlbumMainPageData = {
      rating,
      albumData,
      addedAt: Date.now(),
    };

    isAlbumSelected(false);

    const filtered = albumsMainPage?.filter((album) => {
      const albumData = album.data || album.albumData;
      return albumData?.name !== AlbumMainPageData?.albumData?.name;
    });

    const updatedAlbums = [...filtered, AlbumMainPageData];
    setAlbumsMainPage(updatedAlbums);

    const { data, error } = await supabase
      .from("Accounts")
      .update({ albums: updatedAlbums })
      .eq("id", user.id);

    const { _, top100Error } = await supabase
      .from("Accounts")
      .update({ top100: updatedAlbums })
      .eq("id", user.id);

    if (top100Error) {
      console.error("error occured while updating top 100");
      return;
    }
    if (error) console.error("Error updating albums: ", error);
    else console.log("Albums updated successfully: ", data);
  }

  async function removeAlbum(name) {
    const filtered = albumsMainPage?.filter((album) => {
      return album.albumData.name !== name;
    });

    const { __, error } = await supabase
      .from("Accounts")
      .update({ albums: filtered })
      .eq("id", user.id);

    const { ___, top100Error } = await supabase
      .from("Accounts")
      .update({ top100: filtered })
      .eq("id", user.id);

    if (error) console.error(error);
    if (top100Error) console.error(top100Error);
    isAlbumSelected(false);
  }

  return (
    <div className="Album-page">
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          <div className="Album">
            <img src={albumData.image[3]["#text"]} alt="img" />
            <div className="metadata">
              <div
                className="additional-data"
                style={
                  albumData.name.includes(" ")
                    ? {
                        gap: "1rem",
                      }
                    : null
                }
              >
                <div className="artist-album">
                  <h2
                    style={
                      albumData.name.includes(" ")
                        ? {
                            marginTop: "20px",
                            fontSize: "2.3rem",
                            width: "fit-content",
                          }
                        : null
                    }
                  >
                    {albumData.name}
                  </h2>
                  <p style={{ fontSize: "larger", marginLeft: "3px" }}>
                    {albumData.artist}
                  </p>
                </div>
                <div className="metadata-meta">
                  <p>Length: 1 hr</p>
                  <p>Tracks: {albumData?.tracks?.track?.length || "unknown"}</p>
                  <p>Date: 2016</p>
                </div>
              </div>
              <div className="stars">
                <StarRate
                  rating={rating}
                  setRating={setRating}
                  size={"2.2rem"}
                />
              </div>
              <div id="btns">
                <button id="save-btn" onClick={() => GetData()}>
                  save
                </button>
                <button
                  id="delete-btn"
                  onClick={() => removeAlbum(albumData.name)}
                >
                  delete
                </button>
              </div>
            </div>
            <div>
              <p style={{ width: "450px", transform: "translateX(-40px)" }}>
                {data?.album?.wiki?.summary}
              </p>
            </div>
          </div>
          <div className="tracks-tags">
            <Tracks tracks={tracks} albumName={albumData.name} />
            <Tags tags={data?.album?.tags?.tag} />
          </div>
        </>
      )}
    </div>
  );
}

export default Album;
