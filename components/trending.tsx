import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { ResizeMode, Video } from 'expo-av';
import { memo, useState } from 'react';
import { FlatList, Image, ImageBackground, ImageStyle, TextStyle, TouchableOpacity, ViewStyle, ViewToken } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Models } from 'react-native-appwrite';


type TrendingProps = {
    posts: Models.Document[];
}

export const Trending = memo(({ posts }: TrendingProps) => {
    const [activeItemId, setActiveItemId] = useState(posts[0]?.$id);

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken<Models.Document>[] }) => {
        if (viewableItems.length > 0) {
            setActiveItemId(viewableItems[0].key)
        }
    }

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-x-5 p-5`}
            data={posts}
            keyExtractor={item => item.$id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TrendingItem
                    item={item}
                    activeItemId={activeItemId}
                />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 85
            }}
            contentOffset={{ x: 90, y: 0 }}
        />
    )
})

type TrendingItemProps = {
    activeItemId: string;
    item: Models.Document;
}

const TrendingItem = ({ activeItemId, item }: TrendingItemProps) => {
    const [play, setPlay] = useState(false);    

    return (
        <Animatable.View
            animation={activeItemId === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    style={tw`w-52 h-72 rounded-[35px] mt-3 bg-white/10`}
                    resizeMode={ResizeMode.CONTAIN}
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
                    style={tw`relative justify-center items-center`}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        resizeMode='cover'
                        style={tw`w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40`}
                    />
                    <Image
                        source={icons.play}
                        resizeMode='contain'
                        style={tw`w-12 h-12 absolute`}
                    />

                </TouchableOpacity>
            )}
        </Animatable.View>
    )

}

const zoomIn = {
    from: {
        scale: 0.9
    },
    to: {
        scale: 1
    }
} as Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle>

const zoomOut = {
    from: {
        scale: 1
    },
    to: {
        scale: 0.9
    }
} as Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle>