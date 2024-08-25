import { GlobalContextProvider, useGlobalContext } from "@/contexts/global-provider";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, useSegments } from "expo-router";
import { useEffect } from "react";



SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoggedIn } = useGlobalContext();
  const segments = useSegments();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  })

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded, error])


  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    const searchRoute = segments[0] === 'search';

    if (isLoggedIn && !inTabsGroup) {
      router.replace('/home')
    }

    if ((inTabsGroup || searchRoute) && !isLoggedIn) {
      router.replace('/sign-in')
    }
  }, [isLoggedIn])


  if (!fontsLoaded && !error || !fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search/[query]" />
    </Stack>
  )

}

export default function RootLayout() {
  return (
    <GlobalContextProvider>
      <InitialLayout />
    </GlobalContextProvider>
  )
}
