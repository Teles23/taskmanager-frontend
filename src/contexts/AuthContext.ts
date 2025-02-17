import { createContext } from "react";
import { AuthContextType } from "../utils/authContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
