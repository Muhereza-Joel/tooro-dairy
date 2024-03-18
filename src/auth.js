// auth.js
import Cookies from "js-cookie";
import API_BASE_URL from "./components/appConfig";
const isAuthenticated = () => {
  const authToken = Cookies.get("tdmis")
    ? JSON.parse(Cookies.get("tdmis")).id
    : null;
  return !!authToken;
};

const login = async (email, password) => {

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      mode: "cors",
    });

    const result = await response.json();

    if (response.ok && result.success) {
      Cookies.set(
        "tdmis",
        JSON.stringify({
          authToken: result.authToken,
          username: result.username,
          id: result.id,
          role: result.role,
          email: result.email,
          password: result.password,
          profileCreated: result.profileCreated,
        })
      );
      return { success: true, username: result.username, profileCreated: result.profileCreated };
    } else {
      return { success: false, username: null };
      
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, username: null };
  }
};

const logout = () => {
  Cookies.remove("tdmis");
};

export { isAuthenticated, login, logout };
