// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";
// const API_URL = import.meta.env.VITE_API_URL;

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${API_URL}/auth/login`, form);

//       const { role } = res.data;

//       // store auth state
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("userRole", role);

//       if (role === "superadmin") {
//         navigate("/dashboard");
//       } else if (role === "admin") {
//         navigate("/read");
//       } else {
//         alert("Unauthorized user");
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="loginhead">Login</h2>
//         <form onSubmit={handleSubmit} className="auth-form">
//           <input
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             required
//             autoComplete="username"
//           />
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//             autoComplete="current-password"
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);

      const { role } = res.data;

      // store auth state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);

      if (role === "superadmin") {
        navigate("/dashboard");
      } else if (role === "admin") {
        navigate("/read");
      } else {
        alert("Unauthorized user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      {/* Bubble background */}
      <div className="bubble-layer">
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
        <span className="bubble b6" />
        <span className="bubble b7" />
        <span className="bubble b8" />
        <span className="bubble b9" />
        <span className="bubble b10" />
      </div>

      <div className="auth-background" />

      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder=" "
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder=" "
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <label>Password</label>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <span>© {new Date().getFullYear()} Secure Portal</span>
        </div>
      </div>
    </div>
  );
}
