import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  function handleLogOut() {
    const storedSessionName = "sb-talmzswbtzwycpmgdfzb-auth-token";
    localStorage.setItem(storedSessionName, "");
    navigate("/");
  }
  return (
    <div className="p-2">
      <button
        onClick={() => handleLogOut()}
        className=" bg-red-400 px-2 py-3 rounded hover:scale-105 "
      >
        Log out
      </button>
    </div>
  );
}

export default Account;
