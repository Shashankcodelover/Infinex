const API = "http://localhost:5000/api";

/* =========================
   LOGIN LOGIC
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message.innerText = data.message || "Login failed";
        return;
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect
      window.location.href = "../dashboard/dashboard.html";

    } catch (error) {
      console.error("Login Error:", error);
      message.innerText = "Server error. Please try again.";
    }
  });
}

/* =========================
   SIGNUP LOGIC
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message.innerText = data.message || "Signup failed";
        return;
      }

      alert("Signup successful! Please login.");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Signup Error:", error);
      message.innerText = "Server error. Please try again.";
    }
  });
}