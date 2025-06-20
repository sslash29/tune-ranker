import { useContext, useState } from "react";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

function FilterAlbums({ setAlbumsMainPage, albumsMainPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("high");
  const { user } = useContext(UserContext);

  async function HighestRated() {
    // Create a new sorted array without mutating state directly
    const highestRated = [...albumsMainPage].sort(
      (a, b) => b.rating - a.rating
    );
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: highestRated })
      .eq("id", user.id);
    setIsActive("high");
  }

  async function LowestRated() {
    // Create a new sorted array without mutating state directly
    const lowestRated = [...albumsMainPage].sort((a, b) => {
      console.log(a, b);
      return a.rating - b.rating;
    });

    setAlbumsMainPage(lowestRated);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: lowestRated })
      .eq("id", user.id);
    setIsActive("low");
  }

  async function NewestAdded() {
    const newest = [...albumsMainPage].sort((a, b) => b.addedAt - a.addedAt);
    setAlbumsMainPage(newest);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: newest })
      .eq("id", user.id);
    setIsActive("new");
  }

  async function OldestAdded() {
    const oldest = [...albumsMainPage].sort((a, b) => a.addedAt - b.addedAt);
    setAlbumsMainPage(oldest);
    const { _ } = await supabase
      .from("Accounts")
      .update({ albums: oldest })
      .eq("id", user.id);
    setIsActive("old");
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <p onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
        Filter
      </p>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            background: "white",
            padding: "1rem",
            cursor: "pointer",
          }}
        >
          <p
            className={`hover:bg-gray-200 transition-all px-2 py-1 rounded ${
              isActive === "high" ? "bg-gray-300 font-semibold" : ""
            }`}
            onClick={HighestRated}
          >
            Highest Rated
          </p>
          <p
            className={`hover:bg-gray-200 transition-all px-2 py-1 rounded ${
              isActive === "low" ? "bg-gray-300 font-semibold" : ""
            }`}
            onClick={LowestRated}
          >
            Lowest Rated
          </p>
          <p
            className={`hover:bg-gray-200 transition-all px-2 py-1 rounded ${
              isActive === "new" ? "bg-gray-300 font-semibold" : ""
            }`}
            onClick={NewestAdded}
          >
            Newest
          </p>
          <p
            className={`hover:bg-gray-200 transition-all px-2 py-1 rounded ${
              isActive === "old" ? "bg-gray-300 font-semibold" : ""
            }`}
            onClick={OldestAdded}
          >
            Oldest
          </p>
        </div>
      )}
    </div>
  );
}

export default FilterAlbums;
