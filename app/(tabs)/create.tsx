import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MOODS } from '../../src/constants/moods';
import { addDiary } from '../../src/features/diary/diarySlice';
import { useAppDispatch } from '../../src/store/hooks';
import { COLORS, RADIUS, SPACE, TYPO } from '../../src/styles/tokens';

const MIN_TITLE = 3;

// Tanggal lokal perangkat (bukan UTC) format YYYY-MM-DD
function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Isi form = local state (hanya dipakai di screen ini)
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState(MOODS[0]);

  const titleTooShort = title.length > 0 && title.trim().length < MIN_TITLE;

  const saveDiary = () => {
    if (title.trim().length < MIN_TITLE) {
      Alert.alert('Validasi', `Judul minimal ${MIN_TITLE} karakter`);
      return;
    }
    if (!body.trim()) {
      Alert.alert('Validasi', 'Isi diary wajib diisi');
      return;
    }

    // Data dipindahkan ke global state (Redux)
    dispatch(
      addDiary({
        title: title.trim(),
        date: todayString(),
        preview: body.trim().slice(0, 100),
        body: body.trim(),
        mood,
      })
    );

    setTitle('');
    setBody('');
    setMood(MOODS[0]);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tambah Diary</Text>

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

      <Pressable onPress={saveDiary} style={styles.button}>
        <Text style={styles.buttonText}>Simpan ke Redux</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACE.l, gap: SPACE.m, backgroundColor: COLORS.background },
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
});
