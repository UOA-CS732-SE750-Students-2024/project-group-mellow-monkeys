import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { REGISTER_URL, LOGIN_URL } from "../urls";

// create the useAuth hook with its own context
export const AuthContext = React.createContext();

const initialAuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: "",
  id: "",
  name: "",
  email: "",
  password: "",
  token: "",
  avatar: "",
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuthState);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // LOGIN
  const submitLogin = async (e, userData) => {
    setAuth({ ...auth, isLoading: true });
    if (e) e.preventDefault();
    let newAuth = { ...auth };
    newAuth.email = userData.email;
    newAuth.password = userData.password;
    console.log("submitLogin -> ", userData.email);

    try {
      const response = await axios.post(LOGIN_URL, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("submitLogin -> response: ", response);
      if (response.status === 200) {
        toast.success("Login success");

        newAuth.isAuthenticated = true;
        newAuth.isLoading = false;
        newAuth.error = "";
        newAuth.id = response?.data?.user?._id;
        newAuth.name = response?.data?.user?.name;
        newAuth.email = response?.data?.user?.email;

        newAuth.avatar = response?.data?.user?.avatar;

        newAuth.token = response?.data?.token;
        
        newAuth.loginTime = response?.data?.user?.loginTime;

        sessionStorage.setItem("token", response.data.token);

        // Save user ID in session storage
        sessionStorage.setItem("userId", response.data.user._id);
        if (newAuth.loginTime === 1) {
        navigate("/survey", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      }
    } catch (error) {
      console.log("submitLogin -> error: ", error);

      newAuth.isAuthenticated = false;
      newAuth.isLoading = false;
      newAuth.error = error?.response?.data?.error;
    }
    setAuth(newAuth);
  };

  // REGISTERATION
  const submitRegister = async (e, userData) => {
    setAuth({ ...auth, isLoading: true });
    if (e) e.preventDefault();
    let newAuth = { ...auth };

    newAuth.name = userData.name;
    newAuth.email = userData.email;
    newAuth.password = userData.password;
    newAuth.confirmPassword = userData.confirmPassword;

    console.log("submitRegister -> ", userData.name, userData.email);

    try {
      const response = await axios.post(REGISTER_URL, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("submitRegister -> response: ", response);
      if (response.status === 201) {
        toast.success("Register success");
        newAuth.isAuthenticated = true;
        newAuth.isLoading = false;
        newAuth.error = "";

        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log("submitRegister -> error: ", error);
      newAuth.isAuthenticated = false;
      newAuth.isLoading = false;
      newAuth.error = error?.response?.data?.error || "Register Failed";
    }
    setAuth(newAuth);
  };

  //New Survey submit
  const submitSurvey = () => {
    navigate("/login", { replace: true });
  };

  // LOGOUT
  const submitLogout = () => {
    sessionStorage.clear();
    setAuth(initialAuthState);
    toast.success("Logout success");
    navigate("/login", { replace: true });
  };

  // const submitLogout = async () => {
  //   const userId = sessionStorage.getItem("userId");
  //   const token = sessionStorage.getItem("token");

  //   if (!userId || !token) {
  //     toast.error("Session information missing.");
  //     return;
  //   }

  //   try {
  //     // Make a POST request to the logout endpoint
  //     const response = await axios.post(
  //       `http://localhost:8001/user/${userId}/logout`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include the token in the authorization header
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       // If logout is successful
  //       toast.success(response.data.message); // Display a success message from the server
  //       sessionStorage.clear(); // Clear all session storage
  //       setAuth(initialAuthState); // Reset the authentication state
  //       navigate("/login", { replace: true }); // Navigate back to the login page
  //     } else {
  //       // If the server returns a status other than 200
  //       throw new Error("Failed to logout");
  //     }
  //   } catch (error) {
  //     // If there is an error in the request or the server response
  //     console.error("Logout failed:", error);
  //     toast.error(
  //       "Logout failed: " + (error.response?.data?.message || "Server error")
  //     );
  //   }
  // };

  // Function to check if the token has expired
  const isTokenExpired = (token) => {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp < currentTime;
  };

  // Checks if there is a token saved in sessionStorage when mounting the component
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      if (!isTokenExpired(token)) {
        // Valid token, sets the authentication state to authenticated
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: true,
          isLoading: false,
          token: token,
        }));
      }
    } else {
      // No token, sets the authentication state to not authenticated
      setAuth((prevAuth) => ({
        ...prevAuth,
        isLoading: false,
      }));
    }
  }, []);

  // pass the value in the provider and return it
  return (
    <AuthContext.Provider
      value={{ auth, submitLogin, submitRegister, submitLogout, submitSurvey }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
