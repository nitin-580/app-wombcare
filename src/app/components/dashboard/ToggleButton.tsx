import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileType = {
  waterIntake?: number;
  targetWater?: number;
  mood?: string;
  symptoms?: string[];
};

export default function WellnessStatsCards() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;

      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("WELLNESS DASHBOARD RE-FETCH:", data);

      if (data.success) {
        setProfile(data.data);
      }
    } catch (err) {
      console.log("PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch profile dynamically every single time Dashboard gains focus!
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  /* ---------------- DYNAMIC VALUE CALCULATIONS ---------------- */
  const waterIntake = profile?.waterIntake || 0;
  const targetWater = profile?.targetWater || 8;

  // Extract sleep hours dynamically from symptoms array
  const symptoms = Array.isArray(profile?.symptoms) ? profile.symptoms : [];
  const sleepSymptom = symptoms.find(
    (s) => typeof s === "string" && s.startsWith("Sleep:")
  );
  let sleepHours = 0;
  if (sleepSymptom) {
    const parsed = parseInt(sleepSymptom.replace("Sleep:", "").trim(), 10);
    if (!isNaN(parsed)) {
      sleepHours = parsed;
    }
  }

  const rawMood = profile?.mood || "Neutral";
  const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1).toLowerCase();

  return (
    <View style={styles.container}>
      {/* WATER CARD (rendered in Glasses) */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="water-outline" size={28} color="#4F46E5" />
        </View>
        <Text style={styles.value}>{waterIntake} Gl</Text>
        <Text style={styles.label}>Goal {targetWater} Gl</Text>
      </View>

      {/* SLEEP CARD */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="bed-outline" size={28} color="#9F8CF8" />
        </View>
        <Text style={styles.value}>{sleepHours} hrs</Text>
        <Text style={styles.label}>Sleep</Text>
      </View>

      {/* MOOD CARD */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="emoticon-outline"
            size={28}
            color="#FF97B6"
          />
        </View>
        <Text style={styles.value}>{mood}</Text>
        <Text style={styles.label}>Current Mood</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    width: "31%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F4F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    color: "#111",
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
});