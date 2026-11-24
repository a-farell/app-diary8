import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import DiaryCard from '../../src/components/DiaryCard';
import { MOODS } from '../../src/constants/moods';
import {
    selectEntries,
    selectTotalDiary,
    selectTotalFavorite,
    toggleFavorite,
} from '../../src/features/diary/diarySlice';
import { useDiarySearch } from '../../src/hooks/useDiarySearch';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { COLORS, RADIUS, SPACE, TYPO } from '../../src/styles/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // READ state dari Redux Store
  const entries = useAppSelector(selectEntries);
  const totalDiary = useAppSelector(selectTotalDiary);
  const totalFavorite = useAppSelector(selectTotalFavorite);

  // Search & filter mood = state lokal (hanya dipakai di screen ini)
  const {
    query,
    setQuery,
    moodFilter,
    setMoodFilter,
    resetFilter,
    filteredEntries,
    resultCount,
  } = useDiarySearch(entries);

  const searchRef = useRef<TextInput>(null);
  const isFiltering = query.trim() !== '' || moodFilter !== '';

  const openDetail = useCallback(
    (id: number) => {
      router.push({ pathname: '/detail/[id]', params: { id: String(id) } });
    },
    [router]
  );

  const handleReset = useCallback(() => {
    resetFilter();
    searchRef.current?.focus();
  }, [resetFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>

      {/* Statistik (derived state dari Redux) */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalDiary}</Text>
          <Text style={styles.statLabel}>Total Diary</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalFavorite}</Text>
          <Text style={styles.statLabel}>Total Favorite</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          ref={searchRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Cari diary..."
          placeholderTextColor={COLORS.muted}
          style={styles.search}
        />
        <Pressable onPress={handleReset} style={styles.clearButton}>
          <Text style={styles.clearText}>Reset</Text>
        </Pressable>
      </View>

      {/* Filter mood */}
      <View style={styles.moodFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodScroll}
        >
          {MOODS.map((mood) => (
            <Pressable
              key={mood}
              onPress={() => setMoodFilter(mood === moodFilter ? '' : mood)}
              style={[
                styles.moodBadge,
                moodFilter === mood && styles.moodBadgeActive,
              ]}
            >
              <Text style={styles.moodText}>{mood}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.counter}>{resultCount} entri ditemukan</Text>

      <FlatList
        data={filteredEntries}
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
            <Text style={styles.emptyTitle}>
              {isFiltering ? 'Tidak ada hasil' : 'Belum ada diary'}
            </Text>
            <Text style={styles.emptyText}>
              {isFiltering
                ? 'Tidak ada diary yang cocok dengan kata kunci atau mood yang dipilih. Coba ubah pencarian atau tekan tombol Reset.'
                : 'Buku harianmu masih kosong. Buka tab "Tambah" untuk menulis diary pertamamu.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACE.l, backgroundColor: COLORS.background },
  header: {
    fontSize: TYPO.h1,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACE.m,
  },
  statsRow: { flexDirection: 'row', gap: SPACE.m, marginBottom: SPACE.m },
  statCard: {
    flex: 1,
    padding: SPACE.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: TYPO.caption, color: COLORS.muted, marginTop: 2 },
  searchRow: { flexDirection: 'row', gap: SPACE.s },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  clearButton: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  clearText: { color: COLORS.text },
  moodFilterContainer: { marginTop: SPACE.m },
  moodScroll: { gap: SPACE.s },
  moodBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  moodBadgeActive: { borderColor: COLORS.accent, backgroundColor: COLORS.border },
  moodText: { fontSize: 16 },
  counter: { color: COLORS.muted, marginVertical: SPACE.s },
  list: { gap: SPACE.m, paddingBottom: SPACE.xl },
  emptyBox: { alignItems: 'center', paddingTop: 40, paddingHorizontal: SPACE.l },
  emptyTitle: {
    fontSize: TYPO.title,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACE.s,
  },
  emptyText: { textAlign: 'center', color: COLORS.muted, lineHeight: 20 },
});
