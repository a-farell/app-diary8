import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    deleteDiary,
    selectEntryById,
    toggleFavorite,
} from '../../src/features/diary/diarySlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { COLORS, RADIUS, SPACE, TYPO } from '../../src/styles/tokens';

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) => selectEntryById(state, Number(id)));

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.text }}>Diary tidak ditemukan.</Text>
      </View>
    );
  }

  const confirmDelete = () => {
    Alert.alert('Hapus Diary', 'Diary akan dihapus dari Redux Store.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteDiary(entry.id));
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: entry.title }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mood}>{entry.mood}</Text>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.date}>{entry.date}</Text>
        <Text style={styles.body}>{entry.body}</Text>

        <Pressable
          onPress={() => dispatch(toggleFavorite(entry.id))}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteText}>
            {entry.liked ? '❤️ Hapus dari Favorite' : '🤍 Tambah ke Favorite'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({ pathname: '/edit/[id]', params: { id: String(entry.id) } })
          }
          style={styles.editButton}
        >
          <Text style={styles.editText}>Edit Diary</Text>
        </Pressable>

        <Pressable onPress={confirmDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Hapus Diary</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACE.l, gap: SPACE.m, backgroundColor: COLORS.background, flexGrow: 1 },
  mood: { fontSize: 64 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  date: { fontSize: TYPO.caption, color: COLORS.muted },
  body: { fontSize: 16, lineHeight: 24, color: COLORS.text },
  favoriteButton: {
    padding: 14,
    alignItems: 'center',
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favoriteText: { fontWeight: '700', color: COLORS.danger },
  editButton: {
    padding: 14,
    alignItems: 'center',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
  },
  editText: { fontWeight: '700', color: COLORS.background },
  deleteButton: {
    padding: 14,
    alignItems: 'center',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.danger,
  },
  deleteText: { fontWeight: '700', color: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});
