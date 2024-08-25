import { icons } from '@/constants';
import tw from '@/lib/tailwind';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';


type FormFieldProps = TextInputProps & {
    placeholder?: string;
    initialQuery?: string;
    localSearch?: string;
}

export const SearchInput = ({ placeholder, initialQuery, localSearch }: FormFieldProps) => {
    const [query, setQuery] = useState(initialQuery ?? '');
    const pathname = usePathname();

    const onSearchPress = () => {
        if (!query) {
            Alert.alert('Missing query', 'Please input something to search results across database');
            return;
        }

        if (pathname.startsWith('/search')) {
            router.setParams({ query });
        } else {
            router.push({ pathname: `/search/[query]`, params: { query, localSearch: localSearch }});
        }
    }

    return (
        <View style={tw`flex-row items-center px-4 h-16 gap-x-4 rounded-2xl border-2 border-zinc-700 focus:border-secondary`}>
            <TextInput
                value={query}
                placeholder={placeholder}
                placeholderTextColor="#cdcde0"
                onChangeText={setQuery}
                autoCapitalize='none'
                style={tw`flex-1 h-full text-base text-white font-pregular mt-0.5`}
            />
            <TouchableOpacity
                onPress={onSearchPress}
                style={tw`p-2`}
            >
                <Image
                    source={icons.search}
                    resizeMode='contain'
                    style={tw`w-5 h-5`}
                />
            </TouchableOpacity>
        </View>
    )
}