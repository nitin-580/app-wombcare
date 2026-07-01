// app/components/dashboard/ChatSection.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE_HINDI = "Namaste! Main WombCare AI hoon, aapki PCOD aur period wellness helper. Aaj aap kaisa feel kar rahi hain? Aap apna sawal mujhse Hindi/Hinglish mein pooch sakti hain! 🌸";
const INITIAL_MESSAGE_ENGLISH = "Hello! I am WombCare AI, your dedicated companion for PCOS, PCOD, and hormonal wellness. How can I help you today? Ask me anything about diet, weight management, or periods! 🌸";

export default function AIHealthAssistantCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState<"english" | "hinglish">("hinglish");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  // Setup initial message when modal opens or language changes
  useEffect(() => {
    if (modalVisible) {
      setMessages([
        {
          id: "init",
          role: "assistant",
          content: language === "english" ? INITIAL_MESSAGE_ENGLISH : INITIAL_MESSAGE_HINDI,
        },
      ]);
    }
  }, [modalVisible, language]);

  if (!fontsLoaded) {
    return null;
  }

  // Preset question chips
  const PRESET_QUESTIONS = language === "english" 
    ? [
        { label: "PCOD Weight Gain ", text: "How to manage PCOD weight gain naturally?" },
        { label: "Irregular Periods ", text: "What causes irregular periods and how to treat it?" },
        { label: "Can I Conceive? ", text: "Can I conceive naturally with PCOS?" },
        { label: "WombCare Plans ", text: "What are the WombCare plans, pricing and benefits?" }
      ]
    : [
        { label: "Weight Kaise Kam Karein? ", text: "PCOD mein weight control kaise karein?" },
        { label: "Periods Time Par Kaise Layein? ", text: "Irregular periods thik karne ke tips batayein." },
        { label: "Kya Main Conceive Kar Sakti Hoon? ", text: "PCOS ke sath conceiving ke liye best plan kya hai?" },
        { label: "WombCare Plans pricing? ", text: "WombCare plans aur price details batayein." }
      ];

  // Send message to WombCare Express AI endpoint
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

    // Auto-scroll after user message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Map message history to simple roles for Groq
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
            language: language,
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
            content: language === "english"
              ? "⚠️ I encountered a temporary connection issue. Please try again in a moment! "
              : "⚠️ Server response mein problem aayi hai. Kripya thodi der baad dobara try karein! ",
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
          content: language === "english"
            ? "⚠️ Network error. Please make sure you are connected to the internet."
            : "⚠️ Network connectivity issue hai. Dobara message send kijiye.",
        },
      ]);
    } finally {
      setLoadingAI(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  return (
    <>
      {/* STATIC ASSISTANT WIDGET CARD */}
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={15} color="#5B4CF0" />
            <Text style={styles.badgeText}>AI Companion</Text>
          </View>
          <Text style={styles.title}>Chat with WombCare AI</Text>
          <Text style={styles.subtitle}>
            Get empathetic, instant guidance for PCOD, weight control, periods, and fertility.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Start Conversation </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="chatbubbles" size={60} color="#5B4CF0" />
        </View>
      </View>

      {/* FULL SCREEN INTERACTIVE CHAT ROOM MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          {/* Header */}
          <LinearGradient
            colors={["#FF5CA8", "#5B4CF0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="chevron-back" size={26} color="white" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>WombCare Assitant</Text>
                <Text style={styles.headerSub}>Empathetic PCOD Companion</Text>
              </View>
              <TouchableOpacity 
                style={styles.clearBtn}
                onPress={() => {
                  Alert.alert("Clear Chat", "Are you sure you want to restart the conversation?", [
                    { text: "Cancel" },
                    { text: "Restart", style: "destructive", onPress: () => {
                      setMessages([
                        {
                          id: "init",
                          role: "assistant",
                          content: language === "english" ? INITIAL_MESSAGE_ENGLISH : INITIAL_MESSAGE_HINDI,
                        },
                      ]);
                    }}
                  ]);
                }}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Premium Language segmented controller */}
            <View style={styles.langSelectorRow}>
              <TouchableOpacity
                style={[styles.langChip, language === "english" && styles.activeLangChip]}
                onPress={() => setLanguage("english")}
              >
                <Text style={[styles.langChipText, language === "english" && styles.activeLangChipText]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langChip, language === "hinglish" && styles.activeLangChip]}
                onPress={() => setLanguage("hinglish")}
              >
                <Text style={[styles.langChipText, language === "hinglish" && styles.activeLangChipText]}>
                  Hindi / Hinglish 🇮🇳
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Conversation stream */}
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
                    <View style={styles.aiAvatarWrapper}>
                      <Ionicons name="sparkles" size={14} color="white" />
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

            {/* Bouncing loading indicator */}
            {loadingAI && (
              <View style={[styles.messageBubbleWrapper, styles.bubbleAIWrapper]}>
                <View style={styles.aiAvatarWrapper}>
                  <Ionicons name="sparkles" size={14} color="white" />
                </View>
                <View style={[styles.messageBubble, styles.bubbleAI, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color="#FF5CA8" style={{ marginRight: 6 }} />
                  <Text style={[styles.bubbleText, styles.bubbleTextAI, { fontStyle: "italic" }]}>
                    WombCare AI is typing...
                  </Text>
                </View>
              </View>
            )}

            {/* Quick preset chips - show when chat is short */}
            {messages.length <= 2 && !loadingAI && (
              <View style={styles.presetsWrapper}>
                <Text style={styles.presetsHeading}>Tap a topic to start instantly: </Text>
                <View style={styles.presetChipsGrid}>
                  {PRESET_QUESTIONS.map((chip, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.presetChip}
                      onPress={() => handleSendMessage(chip.text)}
                    >
                      <Text style={styles.presetChipLabel}>{chip.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Chat entry bar footer */}
          <View style={styles.chatFooter}>
            <TextInput
              style={styles.textInput}
              placeholder={language === "english" ? "Ask me anything..." : "Apna sawal poochiye..."}
              placeholderTextColor="#A0A0A0"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
              disabled={!inputText.trim() || loadingAI}
              onPress={() => handleSendMessage(inputText)}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F2F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 11,
    color: "#5B4CF0",
    fontFamily: "PoppinsSemiBold",
  },
  title: {
    fontSize: 20,
    color: "#1F1F1F",
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#777",
    fontFamily: "PoppinsRegular",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#5B4CF0",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
    shadowColor: "#5B4CF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal styling
  modalContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  modalHeader: {
    paddingTop: Platform.OS === "ios" ? 48 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  headerSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontFamily: "PoppinsMedium",
    marginTop: 1,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  langSelectorRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 3,
    marginTop: 18,
  },
  langChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 11,
  },
  activeLangChip: {
    backgroundColor: "white",
  },
  langChipText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
  },
  activeLangChipText: {
    color: "#FF5CA8",
    fontFamily: "PoppinsBold",
  },
  chatStream: {
    flex: 1,
  },
  chatStreamContent: {
    padding: 20,
    paddingBottom: 35,
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
  aiAvatarWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5CA8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: "#5B4CF0",
    borderBottomRightRadius: 4,
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
    borderColor: "#ECECEC",
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
    color: "#2C2C2C",
    fontFamily: "PoppinsRegular",
  },
  presetsWrapper: {
    marginTop: 25,
    paddingHorizontal: 4,
  },
  presetsHeading: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#717171",
    marginBottom: 12,
  },
  presetChipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetChip: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  presetChipLabel: {
    fontSize: 11,
    color: "#4A4A4A",
    fontFamily: "PoppinsMedium",
  },
  chatFooter: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    borderRadius: 20,
    height: 48,
    paddingHorizontal: 18,
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    color: "#333",
  },
  sendButton: {
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
    elevation: 2,
  },
  disabledSendButton: {
    backgroundColor: "#F0F0F0",
    shadowOpacity: 0,
    elevation: 0,
  },
});