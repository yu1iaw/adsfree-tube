import { EmptyList } from "@/components/empty-list";
import { MotionContainer } from "@/components/motion-container";
import { SearchInput } from "@/components/search-input";
import { Trending } from "@/components/trending";
import { VideoCard } from "@/components/video-card";
import { images } from "@/constants";
import { useGlobalContext } from "@/contexts/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import tw from "@/lib/tailwind";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Home() {
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useGlobalContext();
    const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);
    const { data: latestPosts } = useAppwrite(getLatestPosts);
    

    const onRefresh = async () => {
        setRefreshing(true);

        await refetch();
        setRefreshing(false);
    }


    return (
        <SafeAreaView style={tw`bg-primary flex-1 flex-row justify-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`self-center`} />
            ) : (
                <MotionContainer>
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.$id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoCard post={item} refetch={refetch} renderBookmark />
                        )}
                        ListHeaderComponent={(
                            <View style={tw`my-6 px-4 gap-y-6 min-h-[580px]`}>
                                <View style={tw`flex-row justify-between items-start mb-6`}>
                                    <View>
                                        <Text style={tw`font-pmedium text-sm text-gray-100`}>Welcome Back, </Text>
                                        <Text style={tw`text-white text-2xl font-psemibold`}>{user?.username}</Text>
                                    </View>
                                    <View style={tw`mt-1.5`}>
                                        <Image
                                            source={images.logoSmall}
                                            style={tw`w-9 h-10`}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>

                                <SearchInput
                                    placeholder="Search for a video topic"
                                />
                                <View style={tw`flex-1 pt-4 pb-5`}>
                                    <Text style={tw`text-gray-100 text-lg font-pregular`}>Latest Videos</Text>

                                    <Trending posts={latestPosts} />
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={(
                            <EmptyList
                                title="No Videos Found"
                                subtitle="No videos created yet"
                            />
                        )}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </MotionContainer>
            )}
        </SafeAreaView>
    )
}

