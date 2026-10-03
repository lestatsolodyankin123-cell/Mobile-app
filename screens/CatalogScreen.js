import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  PanResponder,
} from "react-native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { I18N, SUPPORTED_LANGS, localizedField } from "../i18n";
import { useLanguage } from "../LanguageContext";

const NAVY = "#0f172a";
const NAVY_DARK = "#070b16";
const GOLD = "#f59e0b";
const SWIPE_THRESHOLD = 60;

export default function CatalogScreen({ navigation }) {
  const { lang, setLang } = useLanguage();
  const strings = I18N[lang];

  const [products, setProducts] = useState([]);
  const [query_, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const loadProducts = useCallback(async () => {
    setRefreshing(true);
    setLoadError(null);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, "products"), orderBy("created_at", "desc")));
      } catch (e) {
        // на случай отсутствия индекса — грузим без сортировки
        snap = await getDocs(collection(db, "products"));
      }
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Свайп влево → лента видео (как в Instagram)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 20 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          navigation.navigate("VideoFeed");
        }
      },
    })
  ).current;

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  let filtered = products.filter((p) =>
    localizedField(p, "name", lang).toLowerCase().includes(query_.toLowerCase())
  );
  if (activeCategory) {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Переключатель языка */}
      <View style={styles.langRow}>
        {SUPPORTED_LANGS.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.langBtn, l === lang && styles.langBtnActive]}
            onPress={() => setLang(l)}
          >
            <Text style={[styles.langText, l === lang && styles.langTextActive]}>
              {I18N[l].langLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProducts} />
        }
        contentContainerStyle={{ padding: 8 }}
        ListHeaderComponent={
          <View>
            {/* Hero-баннер */}
            <View style={styles.hero}>
              <Text style={styles.heroBrand}>
                A<Text style={{ color: GOLD }}>*</Text>New Shop
              </Text>
              <Text style={styles.swipeHint}>{strings.swipeHint}</Text>
            </View>

            {/* Промо-кнопки */}
            <View style={styles.promoRow}>
              <TouchableOpacity
                style={[styles.promoBtn, { backgroundColor: GOLD }]}
                onPress={() =>
                  navigation.navigate("FilteredCatalog", {
                    maxPrice: 100,
                    title: strings.giftsBanner,
                  })
                }
              >
                <Text style={styles.promoTextDark}>{strings.giftsBanner}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.promoBtn, { backgroundColor: NAVY }]}
                onPress={() =>
                  navigation.navigate("FilteredCatalog", {
                    maxPrice: 50,
                    title: strings.budgetBanner,
                  })
                }
              >
                <Text style={styles.promoTextLight}>{strings.budgetBanner}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.search}
              placeholder={strings.search}
              placeholderTextColor="#94a3b8"
              value={query_}
              onChangeText={setQuery}
            />

            {loadError ? (
              <Text style={styles.errorText}>Ошибка загрузки: {loadError}</Text>
            ) : null}

            {/* Категории */}
            {categories.length > 0 && (
              <FlatList
                horizontal
                data={[null, ...categories]}
                keyExtractor={(item) => item || "all"}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10, gap: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      activeCategory === item && styles.chipActive,
                    ]}
                    onPress={() => setActiveCategory(item)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        activeCategory === item && styles.chipTextActive,
                      ]}
                    >
                      {item || strings.allCategories}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          !refreshing && !loadError ? (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              {strings.noProducts}
            </Text>
          ) : null
        }
        renderItem={({ item }) => {
          const isSold = item.in_stock === false;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("ProductDetail", { product: item })}
            >
              <Image
                source={{ uri: item.photo_url || "https://via.placeholder.com/300" }}
                style={styles.image}
              />
              <Text style={styles.name} numberOfLines={1}>
                {localizedField(item, "name", lang)}
              </Text>
              <Text style={styles.price}>
                {item.price} {item.currency || "TMT"}
              </Text>
              {isSold && <Text style={styles.sold}>{strings.sold}</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  langRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    backgroundColor: NAVY,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  langBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
  langText: { color: "#cbd5e1", fontSize: 11, fontWeight: "700" },
  langTextActive: { color: NAVY_DARK },
  hero: {
    backgroundColor: NAVY,
    margin: 10,
    borderRadius: 18,
    padding: 20,
  },
  heroBrand: { color: "#fff", fontSize: 22, fontWeight: "800" },
  swipeHint: { color: "#94a3b8", fontSize: 12, marginTop: 8 },
  promoRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  promoBtn: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  promoTextDark: { color: NAVY_DARK, fontWeight: "800", textAlign: "center" },
  promoTextLight: { color: "#fff", fontWeight: "800", textAlign: "center" },
  search: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  errorText: { color: "#ef4444", textAlign: "center", marginBottom: 10 },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 10,
  },
  chipActive: { backgroundColor: NAVY, borderColor: NAVY },
  chipText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  chipTextActive: { color: "#fff" },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    padding: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  name: { marginTop: 6, fontWeight: "600" },
  price: { color: "#d97706", fontWeight: "800", marginTop: 2 },
  sold: { color: "#ef4444", fontSize: 12, marginTop: 2 },
});
