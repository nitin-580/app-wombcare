// app/components/classes/LiveClassCard.tsx

import React, { useEffect, useState, useCallback } from "react";
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
import YoutubeIframe from "react-native-youtube-iframe";

export type LiveClassType = {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  googleMeetLink?: string;
  instructorName?: string;
  scheduledAt?: string;
  duration?: number;
  isActive: boolean;
  tags: string[];
};

export default function LiveClassCard({
  onPress,
  refreshing,
}: {
  onPress?: (liveClass: LiveClassType) => void;
  refreshing?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [liveClass, setLiveClass] = useState<LiveClassType | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [toggling, setToggling] = useState(false);
  const [updatingMode, setUpdatingMode] = useState(false);

  const fetchLiveClass = useCallback(async () => {
    try {
      // 1. Fetch user role
      const cachedUserData = await AsyncStorage.getItem("userData");
      if (cachedUserData) {
        const parsed = JSON.parse(cachedUserData);
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      }

      // 2. Fetch Link 1 placement
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/placements"
      );
      const result = await response.json();

      let resolvedClass = null;

      if (result.success && Array.isArray(result.data)) {
        const placement = result.data.find((p: any) => p.label === "Link 1");
        if (placement && placement.class) {
          resolvedClass = placement.class;
        }
      }

      // 3. Fallback to general live classes list
      if (!resolvedClass) {
        const fallbackResponse = await fetch(
          "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes?type=live&isActive=true"
        );
        const fallbackResult = await fallbackResponse.json();
        if (fallbackResult.success && fallbackResult.data?.length > 0) {
          resolvedClass = fallbackResult.data[0];
        }
      }

      if (resolvedClass) {
        setLiveClass({
          id: resolvedClass.id,
          title: resolvedClass.title,
          description: resolvedClass.description,
          youtubeVideoId: resolvedClass.youtubeVideoId,
          googleMeetLink: resolvedClass.googleMeetLink,
          instructorName: resolvedClass.instructorName,
          scheduledAt: resolvedClass.scheduledAt,
          duration: resolvedClass.duration,
          isActive: resolvedClass.isActive !== false,
          tags: Array.isArray(resolvedClass.tags) ? resolvedClass.tags : [],
        });
      } else {
        setLiveClass(null);
      }
    } catch (err) {
      console.log("LIVE CLASS FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchLiveClass();
  }, [fetchLiveClass]);

  // Sync with Pull to Refresh
  useEffect(() => {
    if (refreshing) {
      fetchLiveClass();
    }
  }, [refreshing, fetchLiveClass]);

  // Admin class join active status toggler
  const toggleClassActive = async () => {
    if (!liveClass) return;
    try {
      setToggling(true);
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${liveClass.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-api-key": "nitinisacoderandstudent",
          },
          body: JSON.stringify({
            isActive: !liveClass.isActive,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success 🌸", `Live session join status successfully ${!liveClass.isActive ? "activated" : "deactivated"}!`);
        fetchLiveClass();
      } else {
        Alert.alert("Error", data.message || "Failed to update join status.");
      }
    } catch (err) {
      console.log("Toggle class error:", err);
      Alert.alert("Error", "Network connection failed.");
    } finally {
      setToggling(false);
    }
  };

  // Admin active button mode toggler (Google Meet vs YouTube Video watch)
  const setButtonMode = async (mode: "gmeet" | "youtube") => {
    if (!liveClass) return;
    try {
      setUpdatingMode(true);
      // Construct new tags array replacing previous button mode flags
      const cleanedTags = (liveClass.tags || []).filter(
        (t) => t !== "button:gmeet" && t !== "button:youtube"
      );
      const updatedTags = [...cleanedTags, `button:${mode}`];

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/${liveClass.id}`,
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
        fetchLiveClass();
      } else {
        Alert.alert("Error", data.message || "Failed to change button type.");
      }
    } catch (err) {
      console.log("Button toggle error:", err);
      Alert.alert("Error", "Network request failed.");
    } finally {
      setUpdatingMode(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color="#FF5CA8" />
      </View>
    );
  }

  if (!liveClass) {
    return (
      <View style={styles.card}>
        <View style={styles.liveRow}>
          <View style={styles.inactiveDot} />
          <Text style={styles.offlineText}>NO LIVE SESSION</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="moon-outline" size={54} color="#999" />
          <Text style={styles.emptyTitle}>No live wellness class right now</Text>
          <Text style={styles.emptySubtitle}>
            Upcoming wellness sessions and live interactions will appear here automatically.
          </Text>
        </View>
      </View>
    );
  }

  const isAdmin = userRole === "admin";
  const isJoinActive = liveClass.isActive !== false;

  // Determine active button mode based on tags
  const isYoutubeMode = liveClass.tags?.includes("button:youtube");
  const isMeetMode = liveClass.tags?.includes("button:gmeet") || (!isYoutubeMode && !!liveClass.googleMeetLink);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.9 : 1}
      onPress={() => onPress && onPress(liveClass)}
      style={styles.card}
    >
      {/* Dynamic Link Status Headers */}
      <View style={styles.headerRow}>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE CLASS</Text>
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

      {/* Admin Button Configuration Mode Selector Header */}
      {isAdmin && (
        <View style={styles.adminModeContainer}>
          <Text style={styles.adminModeTitle}>⚙️ BUTTON TYPE SELECTOR (ADMIN)</Text>
          {updatingMode ? (
            <ActivityIndicator size="small" color="#FF5CA8" style={{ marginVertical: 8 }} />
          ) : (
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.modeChip, isMeetMode && styles.activeModeChip]}
                onPress={() => setButtonMode("gmeet")}
              >
                <Ionicons name="videocam" size={14} color={isMeetMode ? "white" : "#718096"} />
                <Text style={[styles.modeChipText, isMeetMode && styles.activeModeChipText]}>
                  Google Meet Link
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeChip, isYoutubeMode && styles.activeModeChip]}
                onPress={() => setButtonMode("youtube")}
              >
                <Ionicons name="logo-youtube" size={14} color={isYoutubeMode ? "white" : "#718096"} />
                <Text style={[styles.modeChipText, isYoutubeMode && styles.activeModeChipText]}>
                  YouTube Watch Video
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Text style={styles.title}>{liveClass.title}</Text>

      {liveClass.instructorName ? (
        <Text style={styles.instructor}>By {liveClass.instructorName}</Text>
      ) : null}

      {/* Inline YouTube Player */}
      <View style={styles.videoContainer}>
        <YoutubeIframe height={220} play={false} videoId={liveClass.youtubeVideoId} />
      </View>

      {liveClass.description ? (
        <Text style={styles.description}>{liveClass.description}</Text>
      ) : null}

      {liveClass.scheduledAt ? (
        <Text style={styles.schedule}>
          {new Date(liveClass.scheduledAt).toLocaleString()}
        </Text>
      ) : null}

      {/* Button Row */}
      <View style={styles.buttonFooter}>
        {/* Render dynamic button depending on configured Admin preference */}
        {isJoinActive ? (
          isMeetMode && liveClass.googleMeetLink ? (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => Linking.openURL(liveClass.googleMeetLink!)}
            >
              <Ionicons name="videocam" size={20} color="white" />
              <Text style={styles.joinText}>Join Live Session</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.joinButton, { backgroundColor: "#111" }]}
              onPress={() => onPress && onPress(liveClass)}
            >
              <Ionicons name="logo-youtube" size={20} color="white" />
              <Text style={styles.joinText}>Watch Live Video</Text>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.disabledJoinButton}>
            <Ionicons name="videocam-off" size={20} color="#A0AEC0" />
            <Text style={styles.disabledJoinText}>Join Deactivated</Text>
          </View>
        )}

        {/* Admin toggler actions */}
        {isAdmin && (
          <TouchableOpacity
            style={[
              styles.adminToggleButton,
              isJoinActive ? styles.adminDeactivate : styles.adminActivate,
            ]}
            disabled={toggling}
            onPress={toggleClassActive}
          >
            {toggling ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.adminToggleText}>
                {isJoinActive ? "⚙️ DEACTIVATE" : "⚙️ ACTIVATE"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    height: 220,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F6",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5CA8",
    marginRight: 8,
  },
  liveText: {
    color: "#FF5CA8",
    fontSize: 12,
    fontWeight: "700",
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#999",
    marginRight: 8,
  },
  offlineText: {
    color: "#666",
    fontSize: 12,
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
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  adminModeTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4A5568",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 0.48,
    justifyContent: "center",
  },
  activeModeChip: {
    backgroundColor: "#FF5CA8",
  },
  modeChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4A5568",
    marginLeft: 4,
  },
  activeModeChipText: {
    color: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 14,
    fontWeight: "500",
  },
  videoContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "#000",
  },
  description: {
    color: "#444",
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 12,
  },
  schedule: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    fontWeight: "500",
  },
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F7FAFC",
    paddingTop: 14,
  },
  joinButton: {
    backgroundColor: "#FF5CA8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  joinText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  disabledJoinButton: {
    backgroundColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  disabledJoinText: {
    color: "#A0AEC0",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  adminToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
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
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 14,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});