// app/components/classes/ChatBubble.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabaseClient";

interface ChatMessage {
  id: string;
  classId: string;
  userId: string;
  senderName: string;
  senderRole: "user" | "doctor" | "admin";
  message: string;
  createdAt: string;
}

interface ChatProps {
  classId: string;
}

export default function WombCareChatUI({ classId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadUserCredentials();
  }, []);

  useEffect(() => {
    if (userToken && classId) {
      fetchChatHistory();
      setupRealtimeSubscription();
    }
  }, [userToken, classId]);

  const loadUserCredentials = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const cachedUserData = await AsyncStorage.getItem("userData");
      
      if (token) {
        setUserToken(token);
      }
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        setUserId(parsed.id);
      }
    } catch (err) {
      console.log("Error loading credentials in chat:", err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${classId}/chat`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setMessages(result.data || []);
      }
    } catch (err) {
      console.log("Error fetching chat logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    setConnectionStatus("connecting");

    const uniqueChannelName = `live-chat-${classId}-${Math.random().toString(36).substring(7)}`;

    const channel = supabase
      .channel(uniqueChannelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wombcare_live_chats",
          filter: `class_id=eq.${classId}`,
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            classId: payload.new.class_id,
            userId: payload.new.user_id,
            senderName: payload.new.sender_name,
            senderRole: payload.new.sender_role,
            message: payload.new.message,
            createdAt: payload.new.created_at,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setConnectionStatus("disconnected");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };


  const sendMessage = async () => {
    if (!inputText.trim() || sending || !userToken) return;

    try {
      setSending(true);
      const messageContent = inputText.trim();
      setInputText("");

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${classId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ message: messageContent }),
        }
      );
      const result = await response.json();
      
      if (!result.success) {
        console.log("Failed to send message:", result.message);
      }
    } catch (err) {
      console.log("Send message error:", err);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.userId === userId;
    const isDoctor = item.senderRole === "doctor";
    const isAdmin = item.senderRole === "admin";

    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
        {!isMe && (
          <View style={[styles.avatar, isDoctor ? styles.docAvatar : styles.userAvatar]}>
            <Text style={styles.avatarText}>{isDoctor ? "🩺" : "🌸"}</Text>
          </View>
        )}
        <View style={styles.messageContent}>
          <View style={styles.senderHeader}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            {isDoctor && (
              <View style={styles.docBadge}>
                <Text style={styles.docBadgeText}>DOCTOR</Text>
              </View>
            )}
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
              {item.message}
            </Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      {/* Realtime Status Indicator */}
      <View style={styles.statusBanner}>
        <View style={[styles.statusDot, connectionStatus === "connected" ? styles.statusOnline : styles.statusOffline]} />
        <Text style={styles.statusText}>
          {connectionStatus === "connected" ? "Live Wellness Chat Active" : "Connecting to Live Chat..."}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5CA8" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubbles-outline" size={48} color="#FFD1E6" />
              <Text style={styles.emptyText}>Be the first to say hi! 🌸</Text>
            </View>
          }
        />
      )}

      {/* Message Input Box */}
      <View style={styles.inputArea}>
        <TextInput
          placeholder="Type a message to class..."
          placeholderTextColor="#A0AEC0"
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!inputText.trim() || sending}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8FB",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F6",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE3EE",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: "#34D399",
  },
  statusOffline: {
    backgroundColor: "#FB7185",
  },
  statusText: {
    fontSize: 12,
    color: "#D53F8C",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "85%",
  },
  myRow: {
    alignSelf: "flex-end",
  },
  otherRow: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  docAvatar: {
    backgroundColor: "#E0E7FF",
  },
  userAvatar: {
    backgroundColor: "#FFF0F6",
  },
  avatarText: {
    fontSize: 16,
  },
  messageContent: {
    flexDirection: "column",
  },
  senderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5568",
    marginRight: 6,
  },
  docBadge: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  docBadgeText: {
    fontSize: 8,
    color: "white",
    fontWeight: "700",
  },
  adminBadge: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 8,
    color: "white",
    fontWeight: "700",
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  myBubble: {
    backgroundColor: "#FF5CA8",
    borderTopRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "white",
    borderTopLeftRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#2D3748",
  },
  timestamp: {
    fontSize: 10,
    color: "#A0AEC0",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  emptyChat: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#D53F8C",
    marginTop: 10,
    fontWeight: "500",
  },
  inputArea: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#FFE8F0",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFF5F8",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    marginRight: 12,
    fontSize: 14,
    color: "#2D3748",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#FF5CA8",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
