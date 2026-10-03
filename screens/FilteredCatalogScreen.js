import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { I18N, localizedField } from "../i18n";
import { useLanguage } from "../LanguageContext";

const GOLD = "#f59e0b";

export default function FilteredCatalogScreen({ route, navigation }) {
  const { maxPrice, category, title } = route.params || {};
  const { lang } = useLanguage();
  const strings = I18N[lang];

  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: title || strings.allCategories });
  }, [title]);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, "products"), orderBy("created_at", "desc")));
      } catch (e) {
        snap = await getDocs(collection(db, "products"));
      }
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (maxPrice) list = list.filter((p) => (p.price || 0) <= maxPrice);
      if (category) list = list.filter((p) => p.category === category);
      setProducts(list);
    } finally {
      setRefreshing(false);
    }
  }, [maxPrice, category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <FlatList
      style={{ backgroundColor: "#f8fafc" }}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      contentContainerStyle={{ padding: 8 }}
      ListEmptyComponent={
        !refreshing ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>{strings.noProducts}</Text>
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
  );
}

const styles = StyleSheet.create({
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
  price: { color: GOLD, fontWeight: "800", marginTop: 2 },
  sold: { color: "#ef4444", fontSize: 12, marginTop: 2 },
});
