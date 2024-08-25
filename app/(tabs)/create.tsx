import { FormField } from "@/components/form-field";
import { MotionContainer } from "@/components/motion-container";
import { PrimaryBtn } from "@/components/primary-btn";
import { icons } from "@/constants";
import { useGlobalContext } from "@/contexts/global-provider";
import { createVideoPost } from "@/lib/appwrite";
import tw from "@/lib/tailwind";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from 'expo-document-picker';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


type TForm = {
    title: string;
    thumbnail: { uri: string } | null,
    prompt: string;
    video: { uri: string } | null;
}

const INITIAL_FORM: TForm = {
    title: "",
    thumbnail: null,
    prompt: "",
    video: null
};

export default function Create() {
    const { top, bottom, left, right } = useSafeAreaInsets();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const { user } = useGlobalContext();


    const openPicker = async (type: 'image' | 'video') => {
        const result = await DocumentPicker.getDocumentAsync({
            type: type === "image"
                ? ["image/*"]
                : ["video/mp4", "image/gif"],
        })

        if (!result.canceled) {
            if (type === "image") {
                setForm({ ...form, thumbnail: result.assets[0] })
            } else {
                setForm({ ...form, video: result.assets[0] })
            }
        }
    }

    const submit = async () => {
        if (Object.values(form).some(v => !v)) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setUploading(true);

        try {
            await createVideoPost({ ...form, userId: user?.$id });

            Alert.alert("Success", "Post was uploaded successfully");
            router.push('/home');
        } catch (error) {
            Alert.alert("Error", "Failed to upload this file")
        } finally {
            setForm(INITIAL_FORM);
            setUploading(false);
        }
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-primary`}>
            <MotionContainer>
                <ScrollView contentContainerStyle={tw`px-4 py-6`}>
                    <Text style={tw`text-white text-2xl font-psemibold`}>Upload Video</Text>
                    <FormField
                        value={form.title}
                        handleChangeText={(text) => setForm({ ...form, title: text })}
                        title="Video Title"
                        placeholder="Give your video a catch title..."
                        otherStyles="mt-10"
                    />
                    <View style={tw`mt-7 gap-y-2`}>
                        <Text style={tw`text-base text-gray-100 font-pmedium`}>Upload Video</Text>
                        <TouchableOpacity onPress={() => openPicker('video')}>
                            {form.video ? (
                                <Video
                                    source={{ uri: form.video.uri }}
                                    style={tw`w-full h-64 rounded-2xl`}
                                    resizeMode={ResizeMode.COVER}
                                />
                            ) : (
                                <View style={tw`justify-center items-center h-40 px-4 bg-black-100 rounded-2xl`}>
                                    <View style={tw`justify-center items-center border border-dashed border-secondary-100 w-14 h-14`}>
                                        <Image
                                            source={icons.upload}
                                            resizeMode="contain"
                                            style={tw`w-1/2 h-1/2`}
                                        />
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mt-7 gap-y-2`}>
                        <Text style={tw`text-base text-gray-100 font-pmedium`}>Thumbnail Image</Text>
                        <TouchableOpacity onPress={() => openPicker('image')}>
                            {form.thumbnail ? (
                                <Image
                                    source={{ uri: form.thumbnail.uri }}
                                    style={tw`w-full h-64 rounded-2xl`}
                                />
                            ) : (
                                <View style={tw`flex-row justify-center items-center h-16 gap-x-2 px-4 bg-black-100 border-2 border-black-200 rounded-2xl`}>
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        style={tw`w-5 h-5`}
                                    />
                                    <Text style={tw`text-sm text-gray-100 font-pmedium`}>Choose a file</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <FormField
                        value={form.prompt}
                        handleChangeText={(text) => setForm({ ...form, prompt: text })}
                        title="AI Prompt"
                        placeholder="The prompt you used to create video..."
                        otherStyles="mt-7"
                    />
                    <PrimaryBtn
                        title="Create & Publish"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={uploading}
                    />
                </ScrollView>
            </MotionContainer>
        </SafeAreaView>
    )
}
