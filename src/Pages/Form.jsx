import { useContext, useState } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

function isStrongPassword(pw) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

function Form() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { setUser, isSignUp, setIsSignUp, user } = useContext(UserContext);

  // **Login Function**
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

    // 🔍 Fetch user data from Accounts table
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
      navigate("/"); // Or wherever you want to go after login
    }
  };

  // **Sign-Up Function**
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setMessage(
        "Password must be at least 8 characters, include a number and an uppercase letter."
      );
      return;
    }

    setMessage("Signing up...");
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.dir(user);
    const { insertData, insertErr } = await supabase.from("Accounts").insert([
      {
        email: user.email,
        user_id: user.id,
      },
    ]);

    if (insertErr) setMessage(insertErr);

    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>{isSignUp ? "Sign Up" : "Login"}</h2>
        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          style={styles.form}
        >
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.switchText}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={styles.switchButton}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

// **Styles**
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  formBox: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "320px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px",
    marginBottom: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  message: {
    textAlign: "center",
    marginTop: "10px",
    color: "red",
  },
  switchText: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
  },
  switchButton: {
    color: "#3b82f6",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: "4px",
    textDecoration: "underline",
  },
};

export default Form;
