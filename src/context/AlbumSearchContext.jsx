import { useState, createContext } from "react";

const AlbumSearchContext = createContext();

function AlbumSearchProvider({ children }) {
  const [shouldFetch, setShouldFetch] = useState(false);

  return (
    <AlbumSearchContext.Provider value={{ shouldFetch, setShouldFetch }}>
      {children}
    </AlbumSearchContext.Provider>
  );
}

export { AlbumSearchProvider, AlbumSearchContext };
