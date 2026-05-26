import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import ProfileHeader from "./components/profile/ProfileHeader";
import ProfileAvatarCard from "./components/profile/ProfileAvatarCard";
import ProfileStatsRow from "./components/profile/ProfileStatsRow";
import ExpertsSection from "./components/profile/ExpertsSection";
import ProfileMenuList from "./components/profile/ProfileMenuList";
import LogoutButton from "./components/profile/LogoutButton";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProfileData() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      const token = await AsyncStorage.getItem("userToken");

      // Fetch profile data
      const profileResponse = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const profileResult = await profileResponse.json();

      // Fetch history data
      const historyResponse = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historyResult = await historyResponse.json();

      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data);
      }
      if (historyResult.success && Array.isArray(historyResult.data)) {
        setHistory(historyResult.data);
      }
    } catch (err) {
      console.log("Error loading profile screen details:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  // Compute stats averages from history
  const sleepRecords = history.filter(
    (h) => typeof h.sleep === "number" && h.sleep > 0
  );
  const avgSleep =
    sleepRecords.length > 0
      ? (sleepRecords.reduce((sum, h) => sum + h.sleep, 0) / sleepRecords.length).toFixed(1)
      : "7.5";

  const waterRecords = history.filter(
    (h) => typeof h.waterIntake === "number" && h.waterIntake > 0
  );
  const avgWaterGlasses =
    waterRecords.length > 0
      ? waterRecords.reduce((sum, h) => sum + h.waterIntake, 0) / waterRecords.length
      : 7.2;
  const avgWaterLiters = (avgWaterGlasses * 0.25).toFixed(1);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileHeader />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5B4CF0" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >
        <ProfileHeader />

        <ProfileAvatarCard
          name={profile?.name || "Sarah Jenkins"}
          age={profile?.age || 28}
          cycleDay={profile?.cycleDay || 12}
        />

        <ProfileStatsRow
          cycleLength={profile?.cycleLength || 28}
          avgSleep={`${avgSleep}h Avg`}
          avgWater={`${avgWaterLiters}L Avg`}
        />

        <ExpertsSection doctorNote={profile?.doctorNote} />

        <ProfileMenuList />

        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});