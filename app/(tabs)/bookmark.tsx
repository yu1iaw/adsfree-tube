import { EmptyList } from "@/components/empty-list";
import { MotionContainer } from "@/components/motion-container";
import { SearchInput } from "@/components/search-input";
import { VideoCard } from "@/components/video-card";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getCurrentUser } from "@/lib/appwrite";
import tw from "@/lib/tailwind";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Bookmark() {
    const [refreshing, setRefreshing] = useState(false);
    const { data: user, isLoading, refetch } = useAppwrite(getCurrentUser);
    const likedArr = user[0]?.liked.map((video: any) => video.$id);
    

    const onRefresh = async () => {
        setRefreshing(true);

        await refetch();
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`my-auto`} />
            ) : (
                    <MotionContainer>
                        <FlatList
                            data={user[0].liked}
                            keyExtractor={item => item.$id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <VideoCard post={item} likedArr={likedArr} refetch={refetch} renderBookmark />
                            )}
                            ListHeaderComponent={() => (
                                <View style={tw`my-6 px-4`}>
                                    <Text style={tw`text-white text-2xl font-psemibold`}>Saved Videos</Text>
                                    <View style={tw`mt-6 mb-8`}>
                                        <SearchInput
                                            placeholder="Search your saved videos"
                                            localSearch="true"
                                        />
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <EmptyList
                                    title="No Videos Found"
                                    subtitle="No videos found for this search query"
                                />
                            )}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    </MotionContainer>
            )}
        </SafeAreaView>
    )
}