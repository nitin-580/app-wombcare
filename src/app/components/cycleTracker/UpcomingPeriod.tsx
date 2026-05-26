import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CycleLengthCard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) return;
        const parsed = JSON.parse(userData);
        const userId = parsed.id || parsed._id;
        if (!userId) return;
        const token = await AsyncStorage.getItem("userToken");

        const response = await fetch(
          `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
        }
      } catch (err) {
        console.log("Error loading upcoming period card profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#4F46E5" />
      </View>
    );
  }

  const cycleDay = profile?.cycleDay || 1;
  const cycleLength = profile?.cycleLength || 28;
  const daysUntilPeriod = Math.max(0, cycleLength - cycleDay);

  const progressWidth = Math.min(100, Math.max(0, (cycleDay / cycleLength) * 100));

  let headingText = `Next period in ${daysUntilPeriod} days`;
  if (daysUntilPeriod === 0) {
    headingText = "Period expected today!";
  } else if (daysUntilPeriod === 1) {
    headingText = "Next period in 1 day";
  }

  return (
    <View style={styles.card}>
      {/* TOP SECTION */}
      <View style={styles.topSection}>
        {/* LEFT */}
        <View style={styles.leftSection}>
          <Text style={styles.heading}>{headingText}</Text>
          <Text style={styles.subheading}>
            {daysUntilPeriod > 10
              ? "Your body is prepping for ovulation"
              : "Your period phase is approaching"}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.rightSection}>
          <Text style={styles.cycleLabel}>CYCLE LENGTH</Text>
          <Text style={styles.daysText}>{cycleLength} days</Text>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          {/* PERIOD PHASE (First 5 days) */}
          <View style={styles.periodPhase} />

          {/* CURRENT PROGRESS */}
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressWidth}%`,
              },
            ]}
          />

          {/* TODAY INDICATOR */}
          <View
            style={[
              styles.todayDot,
              {
                left: `${Math.max(0, progressWidth - 3)}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* LABELS */}
      <View style={styles.labelsRow}>
        <Text style={styles.sideLabel}>Day 1</Text>
        <Text style={styles.todayLabel}>Today (Day {cycleDay})</Text>
        <Text style={styles.sideLabel}>Day {cycleLength}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 34,
    padding: 20,
    marginBottom: 24,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
    paddingRight: 14,
  },
  heading: {
    fontSize: 20,
    lineHeight: 22,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  subheading: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsRegular",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  cycleLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: "#888",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  daysText: {
    fontSize: 24,
    color: "#4F46E5",
    fontFamily: "PoppinsBold",
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBackground: {
    height: 20,
    borderRadius: 8,
    backgroundColor: "#ECE9F7",
    overflow: "hidden",
    position: "relative",
  },
  periodPhase: {
    position: "absolute",
    left: 0,
    width: "18%", // ~5 days of 28 is ~18%
    height: "100%",
    backgroundColor: "#F8DDE6",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    height: "100%",
    backgroundColor: "#D8D1FF",
  },
  todayDot: {
    position: "absolute",
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sideLabel: {
    fontSize: 13,
    color: "#777",
    fontFamily: "PoppinsRegular",
  },
  todayLabel: {
    fontSize: 14,
    color: "#4F46E5",
    fontFamily: "PoppinsBold",
  },
});