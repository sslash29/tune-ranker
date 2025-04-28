import { useState, createContext } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [top100, setTop100] = useState({});

  return (
    <UserContext.Provider value={{ user, setUser, top100, setTop100 }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
