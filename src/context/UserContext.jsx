import { useState, createContext, useEffect } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [top100, setTop100] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [songs, setSongs] = useState({});
  const [recentAlbums, setRecentAlbums] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        top100,
        setTop100,
        isSignUp,
        setIsSignUp,
        songs,
        setSongs,
        recentAlbums,
        setRecentAlbums,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
