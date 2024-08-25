import { icons } from '@/constants';
import { useGlobalContext } from '@/contexts/global-provider';
import { likePost } from '@/lib/appwrite';
import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Models } from 'react-native-appwrite';



type BookmarkProps = {
    video: Models.Document;
    refetch?: () => Promise<void>;
    likedArr?: string[];
}

export const BookmarkIcon = ({ video, likedArr, refetch }: BookmarkProps) => {    
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useGlobalContext();
    const isLikedFound = likedArr
    ? likedArr.find(id => id === video.$id)
    : video.likes.find((obj: Models.Document) => obj.$id === user?.$id);
        
    let newLikesArr = [...video.likes || likedArr];


    const handleLike = async () => {
        if (isLikedFound) {
            if (likedArr) {
                newLikesArr = newLikesArr.filter((obj: Models.Document) => obj.$id !== video.$id);
            } else {
                newLikesArr = newLikesArr.filter((obj: Models.Document) => obj.$id !== user?.$id);
            }
        } else {
            if (likedArr) {
                newLikesArr.push(video.$id);
            } else {
                newLikesArr.push(user?.$id);
            }
        }

        setIsLoading(true);
        try {
            await likePost(video.$id, newLikesArr);
            refetch && refetch();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Opps... Try again';
            Alert.alert("Error", message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <TouchableOpacity onPress={handleLike} disabled={isLoading} style={tw`p-1`}>
            <Motion.Image
                animate={{
                    scale: isLoading ? 0.6 : 1,
                    opacity: isLoading ? 0.2 : 1,
                    tintColor: isLoading ? 'black' : (isLikedFound ? '#FF9C01': 'white')
                }}
                transition={{
                    default: { duration: 500 },
                    tintColor: { duration: 200 }
                }}
                source={icons.heart}
                style={tw`w-7 h-7`}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )
}