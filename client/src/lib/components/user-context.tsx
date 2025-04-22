"use client";

import { AxiosResponse } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../interfaces/user";
import { backend, IResponse } from "../scripts/backend";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserContextType {
  domReady: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  domReady: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export default function UserContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [domReady, setDomReady] = useState(false);
  const [user, setUser] = useState<null | User>(null);
  const getUserData = useCallback<
    (token: string) => Promise<AxiosResponse<IResponse<User>>>
  >(async (token: string) => {
    return await backend.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);
  const router = useRouter();

  const login = useCallback(async (token: string) => {
    setCookie("token", token);
    const res = await getUserData(token);
    toast.success(`Welcome back, ${res.data.data.name}`);
    setUser(res.data.data);
    router.refresh();
  }, [getUserData, router]);

  const logout = useCallback(() => {
    deleteCookie("token");
    setUser(null);
    router.refresh();
    toast.success("Logged out successfully");
  }, [router]);

  useEffect(() => {
    const token = getCookie("token") as string | null;
    if (token) {
      getUserData(token).then((res) => {
        setUser(res.data.data);
      });
    }
    setDomReady(true);
  }, [getUserData]);

  const userContextValue = useMemo(
    () => ({
      domReady,
      user,
      login,
      logout
    }),
    [domReady, user, login, logout]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      {domReady && children}
    </UserContext.Provider>
  );
}
