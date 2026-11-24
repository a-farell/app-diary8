import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import DiaryCard from '../../src/components/DiaryCard';
import {
    clearAllFavorites,
    selectEntries,
    toggleFavorite,
} from '../../src/features/diary/diarySlice';
import { useLikedEntries } from '../../src/hooks/useLikedEntries';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { COLORS, RADIUS, SPACE, TYPO } from '../../src/styles/tokens';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const entries = useAppSelector(selectEntries);
  const favoriteEntries = useLikedEntries(entries); // derived state

  const openDetail = useCallback(
    (id: number) => {
      router.push({ pathname: '/detail/[id]', params: { id: String(id) } });
    },
    [router]
  );

  const confirmClear = () => {
    Alert.alert(
      'Hapus Semua Favorite',
      'Semua diary akan dihapus dari daftar favorite (diary tidak ikut terhapus).',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => dispatch(clearAllFavorites()),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diary Favorit</Text>
      <View style={styles.topRow}>
        <Text style={styles.counter}>{favoriteEntries.length} diary favorite</Text>
        {favoriteEntries.length > 0 && (
          <Pressable onPress={confirmClear} style={styles.clearButton}>
            <Text style={styles.clearText}>Hapus Semua Favorite</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={favoriteEntries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={item.liked}
            onPress={() => openDetail(item.id)}
            onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Belum ada favorite</Text>
            <Text style={styles.emptyText}>
              Tekan ikon hati pada diary di tab Home, atau tombol "Tambah ke
              Favorite" di halaman detail, agar diary muncul di sini.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACE.l, backgroundColor: COLORS.background },
  header: { fontSize: TYPO.h1, fontWeight: '700', color: COLORS.text, marginBottom: SPACE.s },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE.m,
  },
  counter: { color: COLORS.muted },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.card,
  },
  clearText: { color: COLORS.danger, fontSize: TYPO.caption, fontWeight: '700' },
  list: { gap: SPACE.m, paddingBottom: SPACE.xl },
  emptyBox: { alignItems: 'center', paddingTop: 40, paddingHorizontal: SPACE.l },
  emptyTitle: { fontSize: TYPO.title, fontWeight: '700', color: COLORS.text, marginBottom: SPACE.s },
  emptyText: { textAlign: 'center', color: COLORS.muted, lineHeight: 20 },
});
