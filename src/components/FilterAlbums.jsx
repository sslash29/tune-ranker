import { useState } from "react";

function FilterAlbums({ setAlbumsMainPage, albumsMainPage }) {
  const [isOpen, setIsOpen] = useState(false);

  function HighestRated() {
    // Create a new sorted array without mutating state directly
    const highestRated = [...albumsMainPage].sort(
      (a, b) => b.rating - a.rating
    );

    setAlbumsMainPage(highestRated);
  }

  function LowestRated() {
    // Create a new sorted array without mutating state directly
    const highestRated = [...albumsMainPage].sort(
      (a, b) => a.rating - b.rating
    );

    setAlbumsMainPage(highestRated);
  }

  function NewestAdded() {
    const newest = [...albumsMainPage].sort((a, b) => b.addedAt - a.addedAt);
    setAlbumsMainPage(newest);
  }

  function OldestAdded() {
    const newest = [...albumsMainPage].sort((a, b) => a.addedAt - b.addedAt);
    setAlbumsMainPage(newest);
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
          <p onClick={() => HighestRated()}>Highest Rated</p>
          <p onClick={() => LowestRated()}>Lowest Rated</p>
          <p onClick={() => NewestAdded()}>Newest</p>
          <p onClick={() => OldestAdded()}>Oldest</p>
        </div>
      )}
    </div>
  );
}

export default FilterAlbums;
