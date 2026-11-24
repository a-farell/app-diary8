import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MOODS } from '../../src/constants/moods';
import { editDiary, selectEntryById } from '../../src/features/diary/diarySlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { COLORS, RADIUS, SPACE, TYPO } from '../../src/styles/tokens';

const MIN_TITLE = 3;

export default function EditScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) => selectEntryById(state, Number(id)));

  // Form diisi dengan data yang ada di Redux; perubahan sementara = local state
  const [title, setTitle] = useState(entry?.title ?? '');
  const [body, setBody] = useState(entry?.body ?? '');
  const [mood, setMood] = useState(entry?.mood ?? MOODS[0]);

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.text }}>Diary tidak ditemukan.</Text>
      </View>
    );
  }

  const titleTooShort = title.length > 0 && title.trim().length < MIN_TITLE;

  const saveChanges = () => {
    if (title.trim().length < MIN_TITLE) {
      Alert.alert('Validasi', `Judul minimal ${MIN_TITLE} karakter`);
      return;
    }
    if (!body.trim()) {
      Alert.alert('Validasi', 'Isi diary wajib diisi');
      return;
    }

    dispatch(
      editDiary({
        id: entry.id,
        title: title.trim(),
        body: body.trim(),
        mood,
      })
    );
    router.back(); // kembali ke Detail yang sudah menampilkan data baru
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Edit Diary</Text>

      <View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Judul diary"
          placeholderTextColor={COLORS.muted}
          style={[styles.input, titleTooShort && styles.inputError]}
        />
        {titleTooShort && (
          <Text style={styles.errorText}>Judul minimal {MIN_TITLE} karakter</Text>
        )}
      </View>

      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Ceritakan harimu..."
        placeholderTextColor={COLORS.muted}
        multiline
        style={[styles.input, styles.bodyInput]}
      />

      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodRow}>
        {MOODS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setMood(item)}
            style={[styles.moodButton, mood === item && styles.selectedMood]}
          >
            <Text style={styles.mood}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={saveChanges} style={styles.button}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACE.l, gap: SPACE.m, backgroundColor: COLORS.background, flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: TYPO.caption, marginTop: 4 },
  bodyInput: { minHeight: 140, textAlignVertical: 'top' },
  label: { fontWeight: '700', color: COLORS.text },
  moodRow: { flexDirection: 'row', gap: SPACE.s },
  moodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  selectedMood: { borderColor: COLORS.accent, borderWidth: 2 },
  mood: { fontSize: 28 },
  button: {
    padding: 14,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.background, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});
