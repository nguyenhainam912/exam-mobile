import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Optional: lấy user để ghép session theo user
import { useAppStore } from '../../stores/appStore';

type Message = { id: string; text: string; sender: 'user' | 'ai' };

const N8N_WEBHOOK = process.env.EXPO_PUBLIC_N8N_WEBHOOK || ''; // đặt biến môi trường này

async function getSessionId(keySuffix: string = 'guest') {
  const key = `ai_chat_session_${keySuffix}`;
  const existed = await AsyncStorage.getItem(key);
  if (existed) return existed;
  const gen = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(key, gen);
  return gen;
}

export default function AIChatScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const listRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // Scroll xuống cuối khi keyboard mở
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    });
    return () => sub.remove();
  }, []);

  const append = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg: Message = {
      id: `${Date.now()}`,
      text: trimmed,
      sender: 'user',
    };
    append(userMsg);
    setInput('');
    setSending(true);

    try {
      const id =
        currentUser?.id ??
        currentUser?.userId ??
        (currentUser as any)?._id ??
        'guest';
      const sessionId = await getSessionId(String(id));
      const payload = { sessionId, chatInput: trimmed };

      // Gọi webhook (dùng fetch để tránh phụ thuộc đường dẫn axios)
      if (!N8N_WEBHOOK) {
        throw new Error('Missing EXPO_PUBLIC_N8N_WEBHOOK');
      }
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null as any);
      const reply =
        data?.output ??
        data?.reply ??
        data?.message ??
        (typeof data === 'string' ? data : JSON.stringify(data ?? ''));

      append({
        id: `${Date.now() + 1}`,
        text: String(reply || 'Xin lỗi, mình chưa có phản hồi.'),
        sender: 'ai',
      });
    } catch (e) {
      append({
        id: `${Date.now() + 2}`,
        text: 'Xin lỗi, hiện không gửi được tin. Vui lòng thử lại.',
        sender: 'ai',
      });
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.msgRow,
        item.sender === 'user' ? styles.userRow : styles.aiRow,
      ]}
    >
      <View
        style={item.sender === 'user' ? styles.userBubble : styles.aiBubble}
      >
        <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Chat với AI</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.chatSheet}>
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Nhập câu hỏi..."
              style={styles.input}
              multiline
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              editable={!sending}
            />
            <TouchableOpacity
              style={[styles.sendBtn, sending && { opacity: 0.6 }]}
              onPress={sendMessage}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendText}>Gửi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8B5CF6' },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  flex: { flex: 1 },
  chatSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end', // luôn đẩy tin nhắn xuống đáy
  },
  msgRow: { marginVertical: 6 },
  userRow: { alignSelf: 'flex-end' },
  aiRow: { alignSelf: 'flex-start' },
  userBubble: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: '80%',
  },
  aiBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userText: { color: '#fff', fontSize: 15, lineHeight: 20 },
  aiText: { color: '#111827', fontSize: 15, lineHeight: 20 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    fontSize: 16,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 56,
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
