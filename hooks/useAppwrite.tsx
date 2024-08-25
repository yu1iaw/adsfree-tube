import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";



export const useAppwrite = (fn: () => Promise<Models.Document[]>) => {
    const [data, setData] = useState<Models.Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await fn();
            setData(response);
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Failed to fetch data")
        } finally {
            setIsLoading(false);
        }
    }

    const refetch = () => fetchData();

    return { data, isLoading, setIsLoading, refetch };
}