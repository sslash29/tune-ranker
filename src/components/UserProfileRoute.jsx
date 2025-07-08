import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import supabase from "../supabaseClient";
import Account from "./PublicAccount"; // or wherever your Account component is

function UserProfileRoute() {
  const { id } = useParams();
  const { setViewedUser, setViewedUserId } = useContext(UserContext);

  useEffect(() => {
    if (!id) return;

    setViewedUserId(id);

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("Accounts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching viewed user:", error);
        return;
      }

      setViewedUser(data);
    };

    fetchUser();
  }, [id]);

  return <Account />;
}

export default UserProfileRoute;
