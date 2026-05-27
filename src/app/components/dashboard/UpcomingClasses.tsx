// app/components/dashboard/UpcomingClasses.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";
import LiveClassRoomModal from "../classes/LiveClassRoomModal";

type PlacementClass = {
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

type PlacementType = {
  id: string;
  label: string;
  description: string;
  class?: PlacementClass;
};

export default function UpcomingClassesCard({ refreshing }: { refreshing?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [placements, setPlacements] = useState<PlacementType[]>([]);
  const [userRole, setUserRole] = useState<string>("user");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPlacementsAndRole = useCallback(async () => {
    try {
      // 1. Get role from cache
      const cachedUserData = await AsyncStorage.getItem("userData");
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      }

      // 2. Fetch Placement data from backend
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/placements"
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Filter Link 1, Link 2 & Link 3 for Dashboard rendering
        const filtered = result.data.filter(
          (p: any) => p.label === "Link 1" || p.label === "Link 2" || p.label === "Link 3"
        );
        
        // Ensure tags is always set as array
        const mapped = filtered.map((p: any) => {
          if (p.class) {
            p.class.tags = Array.isArray(p.class.tags) ? p.class.tags : [];
          }
          return p;
        });

        setPlacements(mapped);
      }
    } catch (err) {
      console.log("Error loading dashboard upcoming classes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPlacementsAndRole();
  }, [fetchPlacementsAndRole]);

  // Sync with Pull-to-Refresh from parent dashboard.tsx
  useEffect(() => {
    if (refreshing) {
      fetchPlacementsAndRole();
    }
  }, [refreshing, fetchPlacementsAndRole]);

  // Admin Class activation toggler
  const toggleClassActiveState = async (classId: string, currentStatus: boolean) => {
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

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success 🌸", `Class status successfully ${!currentStatus ? "activated" : "deactivated"}!`);
        fetchPlacementsAndRole();
      } else {
        Alert.alert("Error", result.message || "Failed to alter active state.");
      }
    } catch (err) {
      console.log("Error toggling active state:", err);
      Alert.alert("Error", "Could not connect to service.");
    } finally {
      setTogglingId(null);
    }
  };

  // Admin button mode toggler (Google Meet vs YouTube watch)
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
        fetchPlacementsAndRole();
      } else {
        Alert.alert("Error", data.message || "Failed to update button type.");
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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FF5CA8" />
      </View>
    );
  }

  // Find Link 1, Link 2 and Link 3 assignments
  const link1Placement = placements.find((p) => p.label === "Link 1");
  const link2Placement = placements.find((p) => p.label === "Link 2");
  const link3Placement = placements.find((p) => p.label === "Link 3");

  const hasLiveClassLink1 = link1Placement?.class && link1Placement.class.type === "live";
  const hasLiveClassLink2 = link2Placement?.class && link2Placement.class.type === "live";
  const hasLiveClassLink3 = link3Placement?.class && link3Placement.class.type === "live";
  const noLiveClasses = !hasLiveClassLink1 && !hasLiveClassLink2 && !hasLiveClassLink3;

  const renderClassCard = (placement: PlacementType) => {
    const cls = placement.class;
    if (!cls) return null;

    const isAdmin = userRole === "admin";
    const isJoinActive = cls.isActive !== false;

    // Button mode flags mapping
    const isYoutubeMode = cls.tags?.includes("button:youtube");
    const isMeetMode = cls.tags?.includes("button:gmeet") || (!isYoutubeMode && !!cls.googleMeetLink);

    return (
      <TouchableOpacity
        key={placement.id}
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleCardPress(cls)}
      >
        {/* Placement Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.placementBadge}>
            <Text style={styles.placementBadgeText}>{placement.label} Widget</Text>
          </View>

          {/* Active status indicator badge */}
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

        {/* Admin Configuration row */}
        {isAdmin && (
          <View style={styles.adminModeContainer}>
            <Text style={styles.adminModeTitle}>⚙️ BUTTON TYPE SELECTOR (ADMIN)</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.modeChip, isMeetMode && styles.activeModeChip]}
                disabled={togglingId === cls.id}
                onPress={() => setButtonMode(cls.id, cls.tags, "gmeet")}
              >
                <Ionicons name="videocam" size={12} color={isMeetMode ? "white" : "#718096"} />
                <Text style={[styles.modeChipText, isMeetMode && styles.activeModeChipText]}>
                  Meet Link
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeChip, isYoutubeMode && styles.activeModeChip]}
                disabled={togglingId === cls.id}
                onPress={() => setButtonMode(cls.id, cls.tags, "youtube")}
              >
                <Ionicons name="logo-youtube" size={12} color={isYoutubeMode ? "white" : "#718096"} />
                <Text style={[styles.modeChipText, isYoutubeMode && styles.activeModeChipText]}>
                  Watch Video
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Video Player */}
        {cls.youtubeVideoId ? (
          <View style={styles.videoContainer}>
            <YoutubeIframe height={190} play={false} videoId={cls.youtubeVideoId} />
          </View>
        ) : (
          <Image source={{ uri: cls.thumbnailUrl }} style={styles.thumbnail} />
        )}

        {/* Details segment */}
        <View style={styles.infoContainer}>
          <Text style={styles.classTitle}>{cls.title}</Text>
          {cls.instructorName ? (
            <Text style={styles.instructor}>By {cls.instructorName}</Text>
          ) : null}
          <Text style={styles.description} numberOfLines={2}>
            {cls.description}
          </Text>

          {/* Duration or Schedule */}
          <View style={styles.metadataRow}>
            {cls.duration ? (
              <View style={styles.metadataItem}>
                <Ionicons name="time-outline" size={14} color="#718096" />
                <Text style={styles.metadataText}>{cls.duration} mins</Text>
              </View>
            ) : null}
            {cls.scheduledAt ? (
              <View style={[styles.metadataItem, { marginLeft: 15 }]}>
                <Ionicons name="calendar-outline" size={14} color="#718096" />
                <Text style={styles.metadataText}>
                  {new Date(cls.scheduledAt).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Control Footer */}
        <View style={styles.cardFooter}>
          {/* Join action */}
          {isJoinActive ? (
            isMeetMode && cls.googleMeetLink ? (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => Linking.openURL(cls.googleMeetLink!)}
              >
                <Text style={styles.joinButtonText}>Join Class 🌸</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: "#111" }]}
                onPress={() => handleCardPress(cls)}
              >
                <Text style={styles.joinButtonText}>Watch Class 📺</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.disabledJoinButton}>
              <Text style={styles.disabledJoinButtonText}>Join Deactivated</Text>
            </View>
          )}

          {/* Admin Command State Toggler */}
          {isAdmin && (
            <TouchableOpacity
              style={[
                styles.adminToggleButton,
                isJoinActive ? styles.adminDeactivate : styles.adminActivate,
              ]}
              disabled={togglingId === cls.id}
              onPress={() => toggleClassActiveState(cls.id, isJoinActive)}
            >
              {togglingId === cls.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.adminToggleButtonText}>
                  {isJoinActive ? "⚙️ DEACTIVATE" : "⚙️ ACTIVATE"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (noLiveClasses) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeading}>Live Wellness Placements</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="videocam-off-outline" size={54} color="#FF5CA8" />
          <Text style={styles.emptyCardTitle}>No Live Sessions Right Now</Text>
          <Text style={styles.emptyCardSub}>
            There are currently no active live wellness sessions scheduled on your dashboard. Please stay tuned or check our Classes tab! 🌸
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Live Wellness Placements</Text>

      {hasLiveClassLink1 && link1Placement && renderClassCard(link1Placement)}
      {hasLiveClassLink2 && link2Placement && renderClassCard(link2Placement)}
      {hasLiveClassLink3 && link3Placement && renderClassCard(link3Placement)}

      {/* Global Interactive Modal Workspace */}
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
  container: {
    marginBottom: 24,
  },
  loadingContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  placementBadge: {
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  placementBadgeText: {
    color: "#4A5568",
    fontSize: 10,
    fontWeight: "700",
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
    marginBottom: 12,
  },
  adminModeTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4A5568",
    marginBottom: 6,
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
    backgroundColor: "#FF5CA8",
  },
  modeChipText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#4A5568",
    marginLeft: 4,
  },
  activeModeChipText: {
    color: "white",
  },
  videoContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#EDF2F7",
  },
  infoContainer: {
    paddingVertical: 4,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 4,
  },
  instructor: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 18,
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadataText: {
    fontSize: 11,
    color: "#718096",
    marginLeft: 4,
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F7FAFC",
    paddingTop: 12,
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: "#FF5CA8",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  disabledJoinButton: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledJoinButtonText: {
    color: "#A0AEC0",
    fontSize: 12,
    fontWeight: "600",
  },
  adminToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  adminActivate: {
    backgroundColor: "#319795",
  },
  adminDeactivate: {
    backgroundColor: "#E53E3E",
  },
  adminToggleButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EDF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 8,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginTop: 16,
    fontFamily: "PoppinsBold",
  },
  emptyCardSub: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    fontFamily: "PoppinsRegular",
    paddingHorizontal: 16,
  },
});