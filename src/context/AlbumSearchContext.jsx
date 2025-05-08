import { useState, createContext, useEffect } from "react";

const AlbumSearchContext = createContext();

function AlbumSearchProvider({ children }) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [token, setToken] = useState(null);

  const fetchAccessToken = async () => {
    try {
      const res = await fetch("https://localhost:5000/api/spotify-token");
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
      } else {
        console.error("Failed to get access token:", data);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  };

  // Get token on component mount
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <AlbumSearchContext.Provider
      value={{ shouldFetch, setShouldFetch, token, setToken }}
    >
      {children}
    </AlbumSearchContext.Provider>
  );
}

export { AlbumSearchProvider, AlbumSearchContext };
