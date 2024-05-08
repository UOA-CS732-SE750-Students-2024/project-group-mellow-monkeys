import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            avatar: response.data.user.avatar,
          })
        );

        newAuth.isAuthenticated = true;
        newAuth.isLoading = false;
        newAuth.error = "";
        newAuth.id = response?.data?.user?._id;
        newAuth.name = response?.data?.user?.name;
        newAuth.email = response?.data?.user?.email;
        newAuth.avatar = response?.data?.user?.avatar;
        newAuth.token = response?.data?.token;
        newAuth.loginTime = response?.data?.user?.loginTime;

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
    navigate("/", { replace: true });
  };

  // LOGOUT
  const submitLogout = () => {
    sessionStorage.clear();
    setAuth(initialAuthState);
    navigate("/login", { replace: true });
  };

  // Function to check if the token has expired
  const isTokenExpired = (token) => {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp < currentTime;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (token && user && !isTokenExpired(token)) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuthenticated: true,
        isLoading: false,
        token: token,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }));
    } else {
      if (!token || isTokenExpired(token)) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuthenticated: false,
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
