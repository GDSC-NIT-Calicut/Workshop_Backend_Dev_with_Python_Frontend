"use client";
import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const logout = useCallback(() => {
    toast.success("Logged out successfully");
    setUsername(null);
    setId(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserDetails = async () => {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user details with token:", access_token);
        const response = await axios.get(`${BACKEND_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const data = response.data;
        console.log("User details fetched:", data); 
        setUsername(data.name);
        setId(data.id);
      } catch (error) {
        console.log("Error fetching user details:", error);
        setUsername(null);
        setId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [pathname, username, logout]);

  return (
    <authContext.Provider value={{ username, id, loading, logout }}>
      {children}
    </authContext.Provider>
  );
};
