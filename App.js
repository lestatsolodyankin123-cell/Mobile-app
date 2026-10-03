import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CatalogScreen from "./screens/CatalogScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import FilteredCatalogScreen from "./screens/FilteredCatalogScreen";
import VideoFeedScreen from "./screens/VideoFeedScreen";
import { LanguageProvider } from "./LanguageContext";

const Stack = createNativeStackNavigator();

const NAVY = "#0f172a";

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Catalog"
          screenOptions={{
            headerStyle: { backgroundColor: NAVY },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "800" },
          }}
        >
          <Stack.Screen
            name="Catalog"
            component={CatalogScreen}
            options={{ title: "A*New Shop" }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="FilteredCatalog"
            component={FilteredCatalogScreen}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="VideoFeed"
            component={VideoFeedScreen}
            options={{ title: "Видео", headerStyle: { backgroundColor: "#0f172a" } }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
