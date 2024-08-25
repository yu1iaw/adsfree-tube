import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { AnimatePresence, Motion } from '@legendapp/motion';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Models } from 'react-native-appwrite';
import { BookmarkIcon } from './bookmark-icon';



type VideoCardProps = {
    post: Models.Document;
    refetch?: () => Promise<void>;
    likedArr?: string[];
    renderBookmark?: boolean;
}

export const VideoCard = ({ post: { title, thumbnail, video, creator: { username, avatar } }, post, likedArr, renderBookmark, refetch }: VideoCardProps) => {
    const [play, setPlay] = useState(false);

    return (
        <AnimatePresence>
            <Motion.View
                key="A"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transformOrigin={{ x: "100%", y: "100%" }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 600, delay: 100 }}
                style={tw`items-center px-4 mb-14`}
            >
                <View style={tw`flex-row gap-3 items-center`}>
                    <View style={tw`flex-row flex-1 justify-center items-center`}>
                        <View style={tw`w-[46px] h-[46px] rounded-lg border border-secondary p-0.5 justify-center items-center`}>
                            <Image source={{ uri: avatar }} resizeMode='cover' style={tw`w-full h-full rounded-md`} />
                        </View>
                        <View style={tw`flex-1 ml-3 gap-y-1`}>
                            <Text numberOfLines={1} style={tw`text-white font-psemibold text-sm`}>{title}</Text>
                            <Text numberOfLines={1} style={tw`text-xs text-gray-100 font-pregular`}>{username}</Text>
                        </View>
                    </View>
                    {renderBookmark && <BookmarkIcon video={post} refetch={refetch} likedArr={likedArr} />}
                </View>
                {play ? (
                    <Video
                        source={{ uri: video }}
                        style={tw`w-full h-60 rounded-xl mt-3 bg-white/10`}
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            // @ts-ignore
                            if (status.didJustFinish) setPlay(false);
                        }}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => setPlay(true)}
                        activeOpacity={0.6}
                        style={tw`relative w-full h-60 justify-center items-center rounded-xl mt-3`}
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            style={tw`w-full h-full rounded-xl mt-3`}
                            resizeMode='cover'
                        />
                        <Image
                            source={icons.play}
                            style={tw`w-12 h-12 absolute`}
                            resizeMode='contain'
                        />

                    </TouchableOpacity>
                )}
            </Motion.View>
        </AnimatePresence>
    )
}