import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { IUser } from "../services/authService";
import { getMe } from "../services/authService";

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setTokenState] = useState<string | null>(
        localStorage.getItem("accessToken")
    );
    const [loading, setLoading] = useState(true);

    // Track whether this is the initial mount check or a post-login token set
    const isInitialMount = useRef(true);

    const setToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem("accessToken", newToken);
        } else {
            localStorage.removeItem("accessToken");
        }
        setTokenState(newToken);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setTokenState(null);
        setUser(null);
    };

    useEffect(() => {
        const fetchUser = async () => {
            // Only show loading spinner on the very first mount check,
            // not when setToken is called after a successful login
            if (!isInitialMount.current) {
                // Token was just set by login — fetch user silently, no loading flash
                if (!token) return;
                try {
                    const res = await getMe();
                    setUser(res.data);
                } catch (error) {
                    console.error("GET ME ERROR:", error);
                    logout();
                }
                return;
            }

            // Initial mount: check if a stored token is still valid
            isInitialMount.current = false;

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await getMe();
                setUser(res.data);
            } catch (error) {
                console.error("GET ME ERROR:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, setToken, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
};