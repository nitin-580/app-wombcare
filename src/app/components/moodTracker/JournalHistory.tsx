import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

interface JournalItem {
  id: string;
  mood: string;
  date: string;
  time: string;
  text: string;
}

export default function JournalHistoryCard() {
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  async function fetchJournalHistory() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        // Map history rows containing "Note: ..." to journal entries
        const mapped: JournalItem[] = result.data
          .map((item: any) => {
            const symptoms: string[] = Array.isArray(item.symptoms) ? item.symptoms : [];
            const noteSymptom = symptoms.find((s) => typeof s === "string" && s.startsWith("Note:"));
            if (!noteSymptom && !item.mood) return null; // Only keep logs with note or mood

            const noteText = noteSymptom
              ? noteSymptom.replace("Note: ", "")
              : "Logged mood without note";

            // Format date nicely
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            // Format time nicely
            const timeObj = item.createdAt ? new Date(item.createdAt) : dateObj;
            const formattedTime = timeObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: item.id || item.date,
              mood: item.mood || "neutral",
              date: formattedDate,
              time: formattedTime,
              text: noteText,
            };
          })
          .filter((x): x is JournalItem => x !== null)
          // Sort by date descending (newest first)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setJournals(mapped);
      }
    } catch (err) {
      console.log("Error fetching journal history:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchJournalHistory();
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "happy";
      case "neutral":
      case "calm":
        return "happy-outline";
      case "sad":
        return "sad";
      case "stressed":
        return "sad-outline";
      default:
        return "happy-outline";
    }
  };

  const getMoodColors = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return {
          bg: "#E8E2FF",
          icon: "#6658F5",
        };
      case "neutral":
      case "calm":
        return {
          bg: "#ECEAF3",
          icon: "#7B8191",
        };
      case "sad":
        return {
          bg: "#FFE2E2",
          icon: "#D93B3B",
        };
      case "stressed":
        return {
          bg: "#FFF0E2",
          icon: "#E67E22",
        };
      default:
        return {
          bg: "#ECEAF3",
          icon: "#7B8191",
        };
    }
  };

  // Determine items to display (maximum 5 unless expanded is true)
  const visibleJournals = expanded ? journals : journals.slice(0, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Journal History</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6658F5" />
        </View>
      ) : journals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No journal entries recorded yet.</Text>
        </View>
      ) : (
        <>
          {visibleJournals.map((item) => {
            const colors = getMoodColors(item.mood);
            return (
              <View key={item.id} style={styles.card}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: colors.bg,
                    },
                  ]}
                >
                  <Ionicons
                    name={getMoodIcon(item.mood) as any}
                    size={34}
                    color={colors.icon}
                  />
                </View>

                <View style={styles.content}>
                  <View style={styles.topRow}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>

                  <Text style={styles.description}>{item.text}</Text>
                </View>
              </View>
            );
          })}

          {/* Show More / Show Less Toggle Button */}
          {journals.length > 5 && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.toggleButtonText}>
                {expanded ? "Show Less" : `Show More (${journals.length - 5} entries)`}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#6658F5"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  heading: {
    fontSize: 20,
    color: "#111",
    marginBottom: 20,
    fontFamily: "PoppinsSemiBold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  time: {
    fontSize: 12,
    color: "#777",
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#5B5B6B",
    fontFamily: "PoppinsRegular",
  },
  loadingContainer: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 6,
  },
  toggleButtonText: {
    color: "#6658F5",
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
});