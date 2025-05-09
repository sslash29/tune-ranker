import { useState, createContext } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [top100, setTop100] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <UserContext.Provider
      value={{ user, setUser, top100, setTop100, isSignUp, setIsSignUp }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
