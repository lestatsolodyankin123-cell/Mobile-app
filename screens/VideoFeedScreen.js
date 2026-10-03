import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { I18N } from "../i18n";
import { useLanguage } from "../LanguageContext";

export default function VideoFeedScreen() {
  const { lang } = useLanguage();
  const strings = I18N[lang];
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "products"), where("video_url", "!=", null))
        );
        setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // поле video_url ещё нигде не заполнено — это нормально на данном этапе
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#f59e0b" />
      </View>
    );
  }

  // Лента видео пока не реализована визуально — админка ещё не умеет
  // загружать видео. Как только появится, здесь будет вертикальный
  // свайп-плеер поверх уже готового запроса videos.
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>🎬</Text>
      <Text style={styles.text}>{strings.noVideos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emoji: { fontSize: 40 },
  text: { color: "#94a3b8", fontSize: 15 },
});
