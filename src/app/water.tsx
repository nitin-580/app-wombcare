import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import WaterHeader from "./components/waterTracker/WaterHeader";
import WaterProgressCard from "./components/waterTracker/WaterProgressCard";
import QuickAddWater from "./components/waterTracker/QuickAddWater";
import HydrationInsight from "./components/waterTracker/HydrationInsight";
import ReminderCard from "./components/waterTracker/ReminderCard";
import CustomWaterInputButton from "./components/waterTracker/CustomWater";

export default function WaterScreen() {
  const [waterIntake, setWaterIntake] = useState(0); // stored in glasses
  const [targetWater, setTargetWater] = useState(8); // stored in glasses (default 8)
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function fetchWaterData() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
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
        setWaterIntake(result.data.waterIntake || 0);
        setTargetWater(result.data.targetWater || 8);
      }
    } catch (err) {
      console.log("Error loading water progress:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchWaterData();
    }, [])
  );

  const handleAddWater = async (amount: number) => {
    if (amount <= 0) return;
    try {
      setUpdating(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      const token = await AsyncStorage.getItem("userToken");

      const newIntake = waterIntake + amount;

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            waterIntake: newIntake,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setWaterIntake(newIntake);
        Alert.alert(
          "Hydrated! 💧",
          `Added ${amount} glass${amount > 1 ? "es" : ""} of water.`
        );
      } else {
        Alert.alert("Error", result.message || "Failed to log water.");
      }
    } catch (err) {
      console.log("Error adding water:", err);
      Alert.alert("Error", "An unexpected error occurred while logging water.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSetWaterTotal = async (newTotal: number) => {
    if (newTotal < 0) return;
    try {
      setUpdating(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            waterIntake: newTotal,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setWaterIntake(newTotal);
        Alert.alert(
          "Water Intake Updated 💧",
          `Set current water intake to ${newTotal} glass${newTotal !== 1 ? "es" : ""}.`
        );
      } else {
        Alert.alert("Error", result.message || "Failed to update water.");
      }
    } catch (err) {
      console.log("Error correcting water total:", err);
      Alert.alert("Error", "An unexpected error occurred while correcting water total.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WaterHeader />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#56CCF2" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <WaterProgressCard
            waterIntake={waterIntake}
            targetWater={targetWater}
            updating={updating}
          />

          <QuickAddWater onAdd={handleAddWater} updating={updating} />

          <CustomWaterInputButton
            onAdd={handleAddWater}
            onSetTotal={handleSetWaterTotal}
            updating={updating}
          />

          <HydrationInsight
            waterIntake={waterIntake}
            targetWater={targetWater}
          />

          <ReminderCard waterIntake={waterIntake} targetWater={targetWater} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FDFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});