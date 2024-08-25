import { FormField } from '@/components/form-field';
import { PrimaryBtn } from '@/components/primary-btn';
import { images } from '@/constants';
import { useGlobalContext } from '@/contexts/global-provider';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import tw from '@/lib/tailwind';
import { Motion } from '@legendapp/motion';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const { width } = Dimensions.get("screen");

export default function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const { setUser, setIsLoggedIn} = useGlobalContext();


    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            if (result) {
                setUser(result[0]);
                setIsLoggedIn(true);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'Failed to sign in');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-primary pt-15`}>
            <Motion.ScrollView
                initial={{ x: width, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                    default: {
                        type: "spring", damping: 20, stiffness: 60
                    },
                    opacity: {
                        type: "tween", duration: 700
                    }
                }}
            >
                <View style={tw`px-4 my-6`}>
                    <View style={tw`items-center`}>
                        <Image
                            source={images.logo}
                            resizeMode='contain'
                            style={tw`w-[115px] h-[35px]`}
                        />
                        <Text style={tw`text-2xl text-white font-psemibold mt-10`}>Log in to Aora</Text>
                    </View>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(text: string) => setForm({ ...form, email: text })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(text: string) => setForm({ ...form, password: text })}
                        otherStyles="mt-7"
                        autoCapitalize='none'
                    />
                    <PrimaryBtn
                        title='Sign in'
                        handlePress={submit}
                        containerStyles='mt-11'
                        isLoading={isSubmitting}
                    />
                    <View style={tw`flex-row pt-5 justify-center items-center gap-2`}>
                        <Text style={tw`text-lg text-gray-100 font-pregular`}>Don't have an account?</Text>
                        <Link href="/sign-up" style={tw`text-secondary font-psemibold text-lg`}>Sign Up</Link>
                    </View>
                </View>
            </Motion.ScrollView>
        </SafeAreaView>
    )
}