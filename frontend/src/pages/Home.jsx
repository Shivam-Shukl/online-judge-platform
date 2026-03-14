import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [serverStatus, setServerStatus] = useState("idle"); // 'idle' | 'checking' | 'online' | 'error'

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      // Hitting the problems endpoint to wake up the Render server
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
      setServerStatus("online");
    } catch (error) {
      // If we get a response (even a 404 or 500), the server is awake. 
      // If we get no response, it's a network error/timeout.
      if (error.response) {
        setServerStatus("online");
      } else {
        setServerStatus("error");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "120px",
          paddingBottom: "80px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "20px",
            color: "#22c55e",
          }}
        >
          CodeGrader
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            maxWidth: "700px",
            margin: "auto",
            color: "#cbd5e1",
            lineHeight: "1.6",
          }}
        >
          Practice coding problems, write solutions in C++, Python, or Java,
          and get instant feedback from our automated judging system.
          Improve your problem-solving skills and prepare for technical interviews.
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "25px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >
          <Link
            to="/problems"
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "white",
              padding: "16px 36px",
              fontSize: "1.1rem",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            🚀 Start Coding
          </Link>

          <Link
            to="/login"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "white",
              padding: "16px 36px",
              fontSize: "1.1rem",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            🔐 Login / Sign Up
          </Link>

          <Link
            to="/compiler"
            style={{
              backgroundColor: "#ff9800",
              color: "white",
              padding: "15px 30px",
              fontSize: "1.1rem",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            💻 Open Compiler
          </Link>
        </div>

        {/* SERVER WAKE UP SECTION */}
        <div style={{ marginTop: "40px" }}>
          <button
            onClick={checkServerStatus}
            disabled={serverStatus === "checking" || serverStatus === "online"}
            style={{
              backgroundColor: 
                serverStatus === "online" ? "#16a34a" : 
                serverStatus === "error" ? "#dc2626" : 
                "#475569",
              color: "white",
              padding: "10px 20px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: serverStatus === "checking" || serverStatus === "online" ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
          >
            {serverStatus === "idle" && "🔌 Connect to Backend Server"}
            {serverStatus === "checking" && "⏳ Waking Server... (Takes ~50s)"}
            {serverStatus === "online" && "✅ Server is Online"}
            {serverStatus === "error" && "❌ Connection Failed - Try Again"}
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "40px",
            color: "#22c55e",
          }}
        >
          Platform Features
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "30px",
          }}
        >
          <div style={cardStyle}>
            <h3>⚡ Instant Code Execution</h3>
            <p>Run your solutions instantly and check results with multiple test cases.</p>
          </div>

          <div style={cardStyle}>
            <h3>💻 Multiple Languages</h3>
            <p>Write solutions in C++, Python, and Java using our online coding environment.</p>
          </div>

          <div style={cardStyle}>
            <h3>🧠 Problem Solving</h3>
            <p>Improve algorithmic thinking with curated coding problems.</p>
          </div>

          <div style={cardStyle}>
            <h3>📊 Skill Improvement</h3>
            <p>Practice regularly and strengthen your coding confidence.</p>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          backgroundColor: "#020617",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "40px",
            color: "#22c55e",
          }}
        >
          Platform Stats
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={statStyle}>30+</h2>
            <p>Coding Problems</p>
          </div>

          <div>
            <h2 style={statStyle}>3</h2>
            <p>Languages Supported</p>
          </div>

          <div>
            <h2 style={statStyle}>∞</h2>
            <p>Practice Opportunities</p>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px",
          }}
        >
          Ready to Improve Your Coding Skills?
        </h2>

        <Link
          to="/problems"
          style={{
            backgroundColor: "#22c55e",
            padding: "18px 40px",
            borderRadius: "10px",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "600",
          }}
        >
          Start Practicing
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "12px",
  width: "260px",
  textAlign: "center",
  lineHeight: "1.5",
};

const statStyle = {
  fontSize: "2.5rem",
  color: "#22c55e",
};