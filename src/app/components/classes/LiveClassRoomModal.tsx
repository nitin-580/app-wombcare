// app/components/classes/LiveClassRoomModal.tsx

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";
import ChatBubble from "./ChatBubble";

interface LiveClass {
  id: string;
  title: string;
  youtubeVideoId: string;
  instructorName?: string;
  description?: string;
}

interface LiveClassRoomModalProps {
  visible: boolean;
  onClose: () => void;
  liveClass: LiveClass | null;
}

export default function LiveClassRoomModal({
  visible,
  onClose,
  liveClass,
}: LiveClassRoomModalProps) {
  if (!liveClass) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE ROOM</Text>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {liveClass.title}
            </Text>
            {liveClass.instructorName && (
              <Text style={styles.instructor}>
                by {liveClass.instructorName}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>

        {/* Video Section */}
        <View style={styles.videoWrapper}>
          <YoutubeIframe
            height={220}
            play={true}
            videoId={liveClass.youtubeVideoId}
          />
        </View>

        {/* Real-time Chat Section */}
        <View style={styles.chatSection}>
          <ChatBubble classId={liveClass.id} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  titleSection: {
    flex: 1,
    paddingRight: 12,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E53E3E",
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#E53E3E",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  instructor: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    backgroundColor: "#000",
    overflow: "hidden",
  },
  chatSection: {
    flex: 1,
  },
});
