import { useContext, useState } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function isStrongPassword(pw) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

function Form() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { setUser, isSignUp, setIsSignUp } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (attempts > 3) {
      setMessage("Too many tries. Try again after 30 seconds.");
      setTimeout(() => {
        setAttempts(0);
      }, 30000);
      return;
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      setMessage(authError.message);
      setAttempts((prev) => prev + 1);
      return;
    }

    setMessage("Logging in...");
    const userId = authData.user.id;

    // Check if user already has an account row
    const { data: existingAccount, error: accountFetchError } = await supabase
      .from("Accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    // If not found, insert a new one (no username since it's not collected during login)
    if (accountFetchError || !existingAccount) {
      const { error: insertErr } = await supabase.from("Accounts").insert([
        {
          email: authData.user.email,
          user_id: userId,
          username: `user-${Date.now()}`, // fallback dummy username
        },
      ]);
      if (insertErr) {
        console.error("Insert error:", insertErr.message);
        setMessage("Error creating account data.");
        return;
      }
    }

    const { data: accountData, error: accountError } = await supabase
      .from("Accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (accountError) {
      setMessage("Logged in, but error loading account data.");
      console.error(accountError.message);
    } else {
      setMessage("Login successful!");
      setUser(accountData);
      navigate("/");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setMessage(
        "Password must be at least 8 characters, include a number and an uppercase letter."
      );
      return;
    }

    if (!username.trim()) {
      setMessage("Username is required.");
      return;
    }

    // Check if username is already taken
    const { data: existingUsername } = await supabase
      .from("Accounts")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUsername) {
      setMessage("Username already taken.");
      return;
    }

    setMessage("Signing up...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      }
    );

    if (signUpError) {
      setMessage(signUpError.message);
      return;
    }

    const user = signUpData.user;

    // If email confirmation is required, user will be null
    if (!user) {
      setMessage("Check your email to confirm registration.");
      return;
    }

    const { error: insertErr } = await supabase.from("Accounts").insert([
      {
        email: user.email,
        user_id: user.id,
        username: username,
      },
    ]);

    if (insertErr) {
      console.error("Insert error:", insertErr.message);
      setMessage("Sign-up succeeded but error saving account.");
      return;
    }

    setMessage("Sign-up successful!");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          className="flex flex-col"
        >
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 mb-2 border border-gray-300 rounded"
              required
            />
          )}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="p-2 mb-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mb-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        {message && <p className="text-center mt-3 text-red-500">{message}</p>}
        <p className="text-center mt-4 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 underline ml-1"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Form;
