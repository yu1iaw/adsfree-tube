import { EmptyList } from "@/components/empty-list";
import { MotionContainer } from "@/components/motion-container";
import { SearchInput } from "@/components/search-input";
import { VideoCard } from "@/components/video-card";
import { useAppwrite } from "@/hooks/useAppwrite";
import { searchPosts } from "@/lib/appwrite";
import tw from "@/lib/tailwind";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type TSearchParams = {
    query: string;
    localSearch?: string;
}

export default function Search() {
    const { query, localSearch }: TSearchParams = useLocalSearchParams();
    const { data: posts, isLoading, refetch } = useAppwrite(() => searchPosts(query));

    
    useEffect(() => {
        refetch();
    }, [query])

    
    return (
        <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`my-auto`} />
            ): (
                <MotionContainer>
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.$id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoCard post={item} />
                        )}
                        ListHeaderComponent={() => (
                            <View style={tw`my-6 px-4`}>
                                <Text style={tw`font-pmedium text-sm text-gray-100`}>Search Results</Text>
                                <Text style={tw`text-white text-2xl font-psemibold`}>{query}</Text>
                                <View style={tw`mt-6 mb-8`}>
                                    <SearchInput
                                        placeholder="Search for a video topic"
                                        initialQuery={query}
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
                    />
                </MotionContainer>     
            )}
        </SafeAreaView>
    )
}