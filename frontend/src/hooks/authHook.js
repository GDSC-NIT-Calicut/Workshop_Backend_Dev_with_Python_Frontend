import authContext from "@/context/authContext";
import { useContext } from "react";

const useAuth = () => {
  return useContext(authContext);
};

export default useAuth;
