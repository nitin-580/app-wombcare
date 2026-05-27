// app/components/classes/CompletedClasses.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import LiveClassRoomModal from "./LiveClassRoomModal";

type ClassType = {
  id: string;
  title: string;
  description: string;
  type: "live" | "recorded";
  thumbnailUrl: string;
  videoUrl: string;
  youtubeVideoId: string;
  googleMeetLink?: string;
  scheduledAt?: string;
  instructorName?: string;
  duration?: number;
  isActive: boolean;
  tags: string[];
};

export default function CompletedClasses({ refreshing }: { refreshing?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [userRole, setUserRole] = useState<string>("user");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const fetchClassesAndRole = useCallback(async () => {
    try {
      // 1. Fetch user role
      const cachedUserData = await AsyncStorage.getItem("userData");
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      }

      // 2. Fetch all classes
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes"
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Filter for classes with recap video links
        const filtered = result.data.filter((c: any) => c.youtubeVideoId);
        
        // Ensure tags is always set as array
        const mapped = filtered.map((c: any) => ({
          ...c,
          tags: Array.isArray(c.tags) ? c.tags : [],
        }));

        setClasses(mapped);
      }
    } catch (err) {
      console.log("Error loading completed classes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchClassesAndRole();
  }, [fetchClassesAndRole]);

  // Sync with Pull-to-refresh
  useEffect(() => {
    if (refreshing) {
      fetchClassesAndRole();
    }
  }, [refreshing, fetchClassesAndRole]);

  // Admin Class activation toggler
  const toggleClassActive = async (classId: string, currentStatus: boolean) => {
    try {
      setTogglingId(classId);
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${classId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-api-key": "nitinisacoderandstudent",
          },
          body: JSON.stringify({
            isActive: !currentStatus,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success 🌸", `Session active status successfully ${!currentStatus ? "activated" : "deactivated"}!`);
        fetchClassesAndRole();
      } else {
        Alert.alert("Error", data.message || "Failed to update status.");
      }
    } catch (err) {
      console.log("Toggle class error:", err);
      Alert.alert("Error", "Network connection failed.");
    } finally {
      setTogglingId(null);
    }
  };

  // Admin active button mode toggler
  const setButtonMode = async (classId: string, currentTags: string[], mode: "gmeet" | "youtube") => {
    try {
      setTogglingId(classId);
      const cleanedTags = (currentTags || []).filter(
        (t) => t !== "button:gmeet" && t !== "button:youtube"
      );
      const updatedTags = [...cleanedTags, `button:${mode}`];

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${classId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-api-key": "nitinisacoderandstudent",
          },
          body: JSON.stringify({
            tags: updatedTags,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Mode Saved ✅", `Successfully set active button type to ${mode === "gmeet" ? "Google Meet Link" : "YouTube Watch Video"}!`);
        fetchClassesAndRole();
      } else {
        Alert.alert("Error", data.message || "Failed to change button type.");
      }
    } catch (err) {
      console.log("Mode update error:", err);
      Alert.alert("Error", "Network request failed.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCardPress = (cls: ClassType) => {
    setSelectedClass({
      id: cls.id,
      title: cls.title,
      youtubeVideoId: cls.youtubeVideoId,
      instructorName: cls.instructorName,
      description: cls.description,
    });
    setModalVisible(true);
  };

  if (!fontsLoaded || (loading && !refreshing)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FF5CA8" />
      </View>
    );
  }

  if (classes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Completed</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="videocam-off-outline" size={54} color="#999" />
          <Text style={styles.emptyTitle}>No finished sessions found</Text>
          <Text style={styles.emptySubtitle}>
            Completed live sessions and recap recordings will appear here automatically.
          </Text>
        </View>
      </View>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Completed Sessions</Text>

      <View style={styles.cardList}>
        {classes.map((item, index) => {
          const isJoinActive = item.isActive !== false;

          // Button Mode determination
          const isYoutubeMode = item.tags?.includes("button:youtube");
          const isMeetMode = item.tags?.includes("button:gmeet") || (!isYoutubeMode && !!item.googleMeetLink);

          return (
            <View key={item.id} style={styles.rowCard}>
              {/* TOP HEADER SEGMENT */}
              <View style={styles.badgeRow}>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>RECAP VIDEO</Text>
                </View>

                {isJoinActive ? (
                  <View style={[styles.statusBadge, styles.activeBadge]}>
                    <Text style={styles.statusBadgeText}>✅ JOIN ACTIVATED</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, styles.inactiveBadge]}>
                    <Text style={[styles.statusBadgeText, styles.inactiveBadgeText]}>🚫 JOIN DEACTIVATED</Text>
                  </View>
                )}
              </View>

              {/* Admin Button Selection Panel */}
              {isAdmin && (
                <View style={styles.adminModeContainer}>
                  <Text style={styles.adminModeTitle}>⚙️ BUTTON TYPE SELECTOR (ADMIN)</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity
                      style={[styles.modeChip, isMeetMode && styles.activeModeChip]}
                      disabled={togglingId === item.id}
                      onPress={() => setButtonMode(item.id, item.tags, "gmeet")}
                    >
                      <Ionicons name="videocam" size={12} color={isMeetMode ? "white" : "#718096"} />
                      <Text style={[styles.modeChipText, isMeetMode && styles.activeModeChipText]}>
                        Meet Link
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modeChip, isYoutubeMode && styles.activeModeChip]}
                      disabled={togglingId === item.id}
                      onPress={() => setButtonMode(item.id, item.tags, "youtube")}
                    >
                      <Ionicons name="logo-youtube" size={12} color={isYoutubeMode ? "white" : "#718096"} />
                      <Text style={[styles.modeChipText, isYoutubeMode && styles.activeModeChipText]}>
                        Watch Video
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* TEXT SUMMARY */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCardPress(item)}
                style={styles.detailsClickable}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>
                  {item.scheduledAt
                    ? new Date(item.scheduledAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recorded Lesson"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* ACTION FOOTER */}
              <View style={styles.actionFooter}>
                {/* Watch recap / Join trigger */}
                {isJoinActive ? (
                  isMeetMode && item.googleMeetLink ? (
                    <TouchableOpacity
                      style={styles.watchRow}
                      onPress={() => Linking.openURL(item.googleMeetLink!)}
                    >
                      <Text style={styles.watch}>Join Live</Text>
                      <Ionicons name="videocam-outline" size={20} color="#5B4CF0" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.watchRow}
                      onPress={() => handleCardPress(item)}
                    >
                      <Text style={styles.watch}>Watch Recap</Text>
                      <Ionicons name="play-circle-outline" size={20} color="#5B4CF0" />
                    </TouchableOpacity>
                  )
                ) : (
                  <View style={styles.disabledWatchRow}>
                    <Text style={styles.disabledWatch}>Disabled</Text>
                    <Ionicons name="lock-closed-outline" size={18} color="#A0AEC0" />
                  </View>
                )}

                {/* Admin quick toggle */}
                {isAdmin && (
                  <TouchableOpacity
                    style={[
                      styles.adminToggleButton,
                      isJoinActive ? styles.adminDeactivate : styles.adminActivate,
                    ]}
                    disabled={togglingId === item.id}
                    onPress={() => toggleClassActive(item.id, isJoinActive)}
                  >
                    {togglingId === item.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.adminToggleText}>
                        {isJoinActive ? "⚙️ DEACTIVATE" : "⚙️ ACTIVATE"}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Global Interactive Recap Modal */}
      <LiveClassRoomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedClass(null);
        }}
        liveClass={selectedClass}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 26,
    color: "#111",
    marginBottom: 20,
    fontFamily: "PoppinsBold",
  },
  cardList: {
    backgroundColor: "transparent",
  },
  rowCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F6",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  completedBadge: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: "#4A5568",
    fontSize: 10,
    fontFamily: "PoppinsBold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadge: {
    backgroundColor: "#E6FFFA",
  },
  inactiveBadge: {
    backgroundColor: "#FFF5F5",
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#319795",
  },
  inactiveBadgeText: {
    color: "#E53E3E",
  },
  adminModeContainer: {
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  adminModeTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4A5568",
    marginBottom: 6,
    fontFamily: "PoppinsBold",
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: "center",
  },
  activeModeChip: {
    backgroundColor: "#5B4CF0",
  },
  modeChipText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#4A5568",
    marginLeft: 4,
    fontFamily: "PoppinsMedium",
  },
  activeModeChipText: {
    color: "white",
  },
  detailsClickable: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 18,
    color: "#111",
    marginBottom: 6,
    fontFamily: "PoppinsSemiBold",
  },
  date: {
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsRegular",
  },
  divider: {
    height: 1,
    backgroundColor: "#F2EFF8",
    marginVertical: 14,
  },
  actionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  watchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  watch: {
    color: "#5B4CF0",
    fontSize: 15,
    marginRight: 6,
    fontFamily: "PoppinsSemiBold",
  },
  disabledWatchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  disabledWatch: {
    color: "#A0AEC0",
    fontSize: 13,
    marginRight: 6,
    fontFamily: "PoppinsSemiBold",
  },
  adminToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  adminActivate: {
    backgroundColor: "#319795",
  },
  adminDeactivate: {
    backgroundColor: "#E53E3E",
  },
  adminToggleText: {
    color: "white",
    fontSize: 9,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#111",
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  emptySubtitle: {
    marginTop: 10,
    color: "#777",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "PoppinsRegular",
  },
});