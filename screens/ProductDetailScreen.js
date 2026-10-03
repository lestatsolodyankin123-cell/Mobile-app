import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import { CONTACT_LINK } from "../constants";
import { I18N, localizedField } from "../i18n";
import { useLanguage } from "../LanguageContext";

const GOLD = "#f59e0b";
const NAVY = "#0f172a";

async function openContact() {
  try {
    await Linking.openURL(CONTACT_LINK);
  } catch (e) {
    Alert.alert("Не удалось открыть", "Попробуйте позвонить напрямую: +993 61 24 72 57");
  }
}

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const { lang } = useLanguage();
  const strings = I18N[lang];
  const isSold = product.in_stock === false;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.photo_url || "https://via.placeholder.com/400" }}
        style={styles.image}
      />
      {/* video_url уже поддерживается в данных — полноценный плеер добавим,
          когда в админке появится загрузка видео */}
      <Text style={styles.name}>{localizedField(product, "name", lang)}</Text>
      <Text style={styles.price}>
        {product.price} {product.currency || "TMT"}
      </Text>
      {isSold && <Text style={styles.soldTag}>{strings.sold}</Text>}
      {localizedField(product, "description", lang) ? (
        <Text style={styles.description}>
          {localizedField(product, "description", lang)}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.contactBtn} onPress={openContact}>
        <Text style={styles.contactText}>{strings.contactSeller}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  name: { fontSize: 20, fontWeight: "700" },
  price: { fontSize: 18, color: "#d97706", fontWeight: "800", marginTop: 4 },
  soldTag: { color: "#ef4444", fontWeight: "700", marginTop: 6 },
  description: { fontSize: 15, color: "#333", marginTop: 12, lineHeight: 22 },
  contactBtn: {
    backgroundColor: NAVY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  contactText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
