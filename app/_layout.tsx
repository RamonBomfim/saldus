import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#212529",
        },
        headerTintColor: "#DEE2E6",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="+not-found"
        options={{ title: "Página não encontrada" }}
      />
    </Stack>
  );
}
