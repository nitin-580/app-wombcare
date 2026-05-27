// app/components/classes/UpcomingClassCard.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import LiveClassRoomModal from "./LiveClassRoomModal";

type PlacementType = {
  id: string;
  label: string;
  description: string;
  class?: {
    id: string;
    title: string;
    description: string;
    type: string;
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
};

export default function UpcomingSessions({ refreshing }: { refreshing?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<PlacementType[]>([]);
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

  const fetchPlacements = useCallback(async () => {
    try {
      // 1. Get role from cache
      const cachedUserData = await AsyncStorage.getItem("userData");
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      }

      // 2. Fetch Placements
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/placements"
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Filter Link 2 and Link 3 placements
        const filtered = data.data.filter(
          (p: any) => p.label === "Link 2" || p.label === "Link 3"
        );
        
        // Map data ensuring tags is resolved properly
        const mapped = filtered.map((item: any) => {
          if (item.class) {
            item.class.tags = Array.isArray(item.class.tags) ? item.class.tags : [];
          }
          return item;
        });

        setSessions(mapped);
      }
    } catch (err) {
      console.log("PLACEMENT ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  // Sync with Pull-to-refresh
  useEffect(() => {
    if (refreshing) {
      fetchPlacements();
    }
  }, [refreshing, fetchPlacements]);

  // Admin class join toggle action
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
      const resData = await response.json();
      if (resData.success) {
        Alert.alert("Success 🌸", `Session join status successfully ${!currentStatus ? "activated" : "deactivated"}!`);
        fetchPlacements();
      } else {
        Alert.alert("Error", resData.message || "Failed to update status.");
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

      const resData = await response.json();
      if (resData.success) {
        Alert.alert("Mode Saved ✅", `Successfully set active button type to ${mode === "gmeet" ? "Google Meet Link" : "YouTube Watch Video"}!`);
        fetchPlacements();
      } else {
        Alert.alert("Error", resData.message || "Failed to change button type.");
      }
    } catch (err) {
      console.log("Mode update error:", err);
      Alert.alert("Error", "Network request failed.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCardPress = (cls: any) => {
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

  // Filter sessions that have class assignments
  const activeSessions = sessions.filter((s) => s.class);

  if (activeSessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Upcoming Sessions</Text>
        </View>
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={54} color="#999" />
          <Text style={styles.emptyTitle}>No wellness sessions available</Text>
          <Text style={styles.emptySubtitle}>
            Upcoming wellness classes and guided care sessions will appear here automatically.
          </Text>
        </View>
      </View>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>Upcoming Sessions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* SESSIONS */}
      {activeSessions.map((item, index) => {
        const classData = item.class!;
        const isJoinActive = classData.isActive !== false;

        // Button Mode determination
        const isYoutubeMode = classData.tags?.includes("button:youtube");
        const isMeetMode = classData.tags?.includes("button:gmeet") || (!isYoutubeMode && !!classData.googleMeetLink);

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleCardPress(classData)}
          >
            {/* BADGE ROW */}
            <View style={styles.badgeRow}>
              <View style={styles.linkBadge}>
                <Text style={styles.linkText}>{item.label}</Text>
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

            {/* Admin Active Button Mode Toggler Panel */}
            {isAdmin && (
              <View style={styles.adminModeContainer}>
                <Text style={styles.adminModeTitle}>⚙️ BUTTON TYPE SELECTOR (ADMIN)</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity
                    style={[styles.modeChip, isMeetMode && styles.activeModeChip]}
                    disabled={togglingId === classData.id}
                    onPress={() => setButtonMode(classData.id, classData.tags, "gmeet")}
                  >
                    <Ionicons name="videocam" size={12} color={isMeetMode ? "white" : "#718096"} />
                    <Text style={[styles.modeChipText, isMeetMode && styles.activeModeChipText]}>
                      Meet Link
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modeChip, isYoutubeMode && styles.activeModeChip]}
                    disabled={togglingId === classData.id}
                    onPress={() => setButtonMode(classData.id, classData.tags, "youtube")}
                  >
                    <Ionicons name="logo-youtube" size={12} color={isYoutubeMode ? "white" : "#718096"} />
                    <Text style={[styles.modeChipText, isYoutubeMode && styles.activeModeChipText]}>
                      Watch Video
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* TOP ROW */}
            <View style={styles.topRow}>
              <Image
                source={{
                  uri:
                    classData.thumbnailUrl ||
                    `https://img.youtube.com/vi/${classData.youtubeVideoId}/hqdefault.jpg`,
                }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{classData.title || "Wellness Session"}</Text>
                <View style={styles.timeRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.time}>
                    {classData.scheduledAt
                      ? new Date(classData.scheduledAt).toLocaleString()
                      : "Available Anytime"}
                  </Text>
                </View>
              </View>
            </View>

            {/* DESCRIPTION */}
            {classData.description ? (
              <Text style={styles.description}>{classData.description}</Text>
            ) : null}

            <View style={styles.divider} />

            {/* BOTTOM FOOTER */}
            <View style={styles.bottomRow}>
              <View style={styles.coachRow}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={16} color="white" />
                </View>
                <Text style={styles.coach}>
                  {classData.instructorName || "WombCare Expert"}
                </Text>
              </View>

              {/* ACTION BUTTON ROW */}
              <View style={styles.actionRow}>
                {/* Join action */}
                {isJoinActive ? (
                  isMeetMode && classData.googleMeetLink ? (
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => Linking.openURL(classData.googleMeetLink!)}
                    >
                      <Text style={styles.actionButtonText}>Join</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.watchButton}
                      onPress={() => handleCardPress(classData)}
                    >
                      <Text style={styles.actionButtonText}>Watch</Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <View style={styles.disabledActionButton}>
                    <Text style={styles.disabledActionText}>Disabled</Text>
                  </View>
                )}

                {/* Admin controls */}
                {isAdmin && (
                  <TouchableOpacity
                    style={[
                      styles.adminToggleButton,
                      isJoinActive ? styles.adminDeactivate : styles.adminActivate,
                    ]}
                    disabled={togglingId === classData.id}
                    onPress={() => toggleClassActive(classData.id, isJoinActive)}
                  >
                    {togglingId === classData.id ? (
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
          </TouchableOpacity>
        );
      })}

      {/* Global Room Modal Sync */}
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
    marginBottom: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  heading: {
    fontSize: 24,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  viewAll: {
    fontSize: 16,
    color: "#5B4CF0",
    fontFamily: "PoppinsSemiBold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 18,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F6",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  linkBadge: {
    backgroundColor: "#F4F0FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  linkText: {
    color: "#5B4CF0",
    fontSize: 12,
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
    borderRadius: 16,
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
    paddingHorizontal: 10,
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
  topRow: {
    flexDirection: "row",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 22,
    marginRight: 18,
    backgroundColor: "#EEE",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: "#111",
    marginBottom: 6,
    fontFamily: "PoppinsSemiBold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsRegular",
  },
  description: {
    marginTop: 18,
    color: "#666",
    lineHeight: 24,
    fontFamily: "PoppinsRegular",
  },
  divider: {
    height: 1,
    backgroundColor: "#F2EFF8",
    marginVertical: 18,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coachRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5B4CF0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  coach: {
    fontSize: 12,
    color: "#555",
    fontFamily: "PoppinsMedium",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#5B4CF0",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 8,
  },
  watchButton: {
    backgroundColor: "#111",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  disabledActionButton: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 8,
  },
  disabledActionText: {
    color: "#A0AEC0",
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
  },
  adminToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
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