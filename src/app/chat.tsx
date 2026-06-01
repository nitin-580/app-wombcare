import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE =
  "Hello! I am WombCare AI, your dedicated companion for PCOS, PCOD, and hormonal wellness. How can I help you today? Ask me anything about diet, weight management, or periods! 🌸";

export default function WombCareChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: INITIAL_MESSAGE,
      },
    ]);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setInputText("");
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoadingAI(true);

    // Auto-scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const apiPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiPayload,
            language: "english",
          }),
        }
      );

      const result = await response.json();

      if (result.success && result.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: result.message,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "⚠️ I encountered a temporary connection issue. Please try again! 🌸",
          },
        ]);
      }
    } catch (err) {
      console.log("AI response error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Network connectivity issue. Please check your internet connection.",
        },
      ]);
    } finally {
      setLoadingAI(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const clearChat = () => {
    Alert.alert("Clear Conversation", "Are you sure you want to restart your WombCare AI session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Restart",
        style: "destructive",
        onPress: () => {
          setMessages([
            {
              id: "init",
              role: "assistant",
              content: INITIAL_MESSAGE,
            },
          ]);
        },
      },
    ]);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color="#FF5CA8" />
      </View>
    );
  }

  const PRESET_CHIPS = [
    { label: "PCOS Diet Tips 🥗", text: "What is the best daily diet for PCOS?" },
    { label: "Yoga for Cramps 🌸", text: "Show me yoga poses to relieve period pain." },
    { label: "Can I Conceive? 👶", text: "Can I conceive naturally with irregular cycles?" },
    { label: "Cycle Tracking 📅", text: "How does tracking ovulation support fertility?" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        {/* Header Block */}
        <LinearGradient
          colors={["#FF5CA8", "#5B4CF0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>WombCare AI ✨</Text>
              <Text style={styles.headerSub}>Empathetic Health Assistant</Text>
            </View>

            <TouchableOpacity onPress={clearChat} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Message Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatStream}
          contentContainerStyle={styles.chatStreamContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            const isUser = item.role === "user";
            return (
              <View
                key={item.id}
                style={[
                  styles.messageBubbleWrapper,
                  isUser ? styles.bubbleUserWrapper : styles.bubbleAIWrapper,
                ]}
              >
                {!isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={12} color="white" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.bubbleUser : styles.bubbleAI,
                  ]}
                >
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                    {item.content}
                  </Text>
                </View>
              </View>
            );
          })}

          {loadingAI && (
            <View style={[styles.messageBubbleWrapper, styles.bubbleAIWrapper]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={12} color="white" />
              </View>
              <View style={[styles.messageBubble, styles.bubbleAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#FF5CA8" style={{ marginRight: 6 }} />
                <Text style={[styles.bubbleText, styles.bubbleTextAI, { fontStyle: "italic" }]}>
                  Thinking...
                </Text>
              </View>
            </View>
          )}

          {/* Quick preset chips */}
          {messages.length <= 2 && !loadingAI && (
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsTitle}>Common Questions 🌸</Text>
              <View style={styles.presetsGrid}>
                {PRESET_CHIPS.map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetChip}
                    onPress={() => handleSendMessage(chip.text)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.presetChipLabel}>{chip.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* TextInput entry footer bar - spacing refined to sit cleanly above bottom tab bar */}
        <View style={styles.footerBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask WombCare AI anything..."
            placeholderTextColor="#A0A0A0"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage(inputText)}
            returnKeyType="send"
            autoCorrect={true}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.disabledSendBtn]}
            disabled={!inputText.trim() || loadingAI}
            onPress={() => handleSendMessage(inputText)}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderScreen: {
    flex: 1,
    backgroundColor: "#FFF7FB",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 19,
    fontFamily: "PoppinsBold",
  },
  headerSub: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    fontFamily: "PoppinsMedium",
    marginTop: 2,
  },
  trashBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatStream: {
    flex: 1,
  },
  chatStreamContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Decent padding to ensure nothing gets cut off by absolute floating tab bars
  },
  messageBubbleWrapper: {
    flexDirection: "row",
    marginVertical: 8,
    maxWidth: "85%",
  },
  bubbleUserWrapper: {
    alignSelf: "flex-end",
  },
  bubbleAIWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-end",
    gap: 8,
  },
  aiAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FF5CA8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: "#5B4CF0",
    borderBottomRightRadius: 4,
    shadowColor: "#5B4CF0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleAI: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: "white",
    fontFamily: "PoppinsMedium",
  },
  bubbleTextAI: {
    color: "#2D3748",
    fontFamily: "PoppinsRegular",
  },
  presetsContainer: {
    marginTop: 30,
    paddingHorizontal: 4,
  },
  presetsTitle: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#718096",
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetChip: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  presetChipLabel: {
    fontSize: 11,
    color: "#4A5568",
    fontFamily: "PoppinsMedium",
  },
  footerBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    gap: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 14, // Extra space at bottom to leave clean space above device safe areas
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    height: 48,
    paddingHorizontal: 18,
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    color: "#2D3748",
  },
  sendBtn: {
    backgroundColor: "#FF5CA8",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledSendBtn: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
});