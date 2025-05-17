import { useState } from "react";

function FilterAlbums({ setAlbumsMainPage, albumsMainPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("high");

  function HighestRated() {
    // Create a new sorted array without mutating state directly
    const highestRated = [...albumsMainPage].sort(
      (a, b) => b.rating - a.rating
    );

    setAlbumsMainPage(highestRated);
    setIsActive("high");
  }

  function LowestRated() {
    // Create a new sorted array without mutating state directly
    const lowestRated = [...albumsMainPage].sort((a, b) => a.rating - b.rating);

    setAlbumsMainPage(lowestRated);
    setIsActive("low");
  }

  function NewestAdded() {
    const newest = [...albumsMainPage].sort((a, b) => b.addedAt - a.addedAt);
    setAlbumsMainPage(newest);
    setIsActive("new");
  }

  function OldestAdded() {
    const oldest = [...albumsMainPage].sort((a, b) => a.addedAt - b.addedAt);
    setAlbumsMainPage(oldest);
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
