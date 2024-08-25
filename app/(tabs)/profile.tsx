import { EmptyList } from "@/components/empty-list";
import { InfoBox } from "@/components/info-box";
import { MotionContainer } from "@/components/motion-container";
import { VideoCard } from "@/components/video-card";
import { icons } from "@/constants";
import { useGlobalContext } from "@/contexts/global-provider";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import tw from "@/lib/tailwind";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Profile() {
    const [refreshing, setRefreshing] = useState(false);
    const { user, setUser, setIsLoggedIn } = useGlobalContext();

    const { data: posts, isLoading, refetch } = useAppwrite(() => getUserPosts(user?.$id))


    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    const logout = async () => {
        await signOut();

        setUser(null);
        setIsLoggedIn(false);
    }


    return (
        <SafeAreaView style={tw`bg-primary flex-1 items-center`}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FF9C01" style={tw`my-auto`} />
            ) : (
                <MotionContainer>
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.$id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoCard post={item} />
                        )}
                        ListHeaderComponent={() => (
                            <View style={tw`justify-center items-center mt-6 mb-12 px-4`}>
                                <TouchableOpacity
                                    onPress={logout}
                                    style={tw`items-end mb-10 w-full`}
                                >
                                    <Image
                                        source={icons.logout}
                                        resizeMode="contain"
                                        style={tw`w-6 h-6`}
                                    />
                                </TouchableOpacity>
                                <View style={tw`w-16 h-16 border border-secondary justify-center items-center rounded-lg`}>
                                    <Image
                                        source={{ uri: user?.avatar }}
                                        style={tw`w-[90%] h-[90%] rounded-md`}
                                    />
                                </View>
                                <InfoBox
                                    title={user?.username}
                                    containerStyles='mt-5'
                                    titleStyles='text-lg'
                                />
                                <View style={tw`flex-row mt-5`}>
                                    <InfoBox
                                        title={posts?.length || 0}
                                        subtitle="Posts"
                                        containerStyles='mr-10'
                                        titleStyles='text-xl'
                                    />
                                    <InfoBox
                                        title='1.2k'
                                        subtitle='Followers'
                                        titleStyles='text-xl'
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