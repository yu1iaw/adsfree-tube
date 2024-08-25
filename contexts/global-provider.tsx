import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Models } from "react-native-appwrite";



type TGlobalContext = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: Models.Document | null;
    setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
    isLoading: boolean;
}

const GlobalContext = createContext<TGlobalContext | null>(null);


export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getCurrentUser()
            .then(res => {
                if (res.length) {
                    setIsLoggedIn(true);
                    setUser(res[0]);
                }
            })
            .catch(error => {
                console.log(error);
                setIsLoggedIn(false);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

    const value = useMemo(() => ({
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
    }), [isLoggedIn, setIsLoggedIn, user, setUser, isLoading])

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}


export const useGlobalContext = () => {
    const value = useContext(GlobalContext);

    if (!value) {
        throw new Error(`useGlobalContext must be wrapped inside GlobalContextProvider`);
    }

    return value;
}