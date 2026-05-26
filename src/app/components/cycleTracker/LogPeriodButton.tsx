import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LogPeriodButtonProps {
  onLog: () => void;
}

export default function LogPeriodButton({ onLog }: LogPeriodButtonProps) {
  const [logging, setLogging] = useState(false);

  const handleLogPeriod = async () => {
    try {
      setLogging(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        Alert.alert("Error", "User details not found. Please log in again.");
        return;
      }
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
      }
      const token = await AsyncStorage.getItem("userToken");
      const selectedDate = await AsyncStorage.getItem("selectedPeriodLogDate");

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/period/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: selectedDate ? JSON.stringify({ startDate: selectedDate }) : undefined,
        }
      );

      const result = await response.json();
      if (result.success) {
        const formattedDate = selectedDate
          ? new Date(selectedDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "today";
        Alert.alert(
          "Period Logged",
          `Your period start has been successfully logged for ${formattedDate}!`
        );
        onLog();
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to start period cycle."
        );
      }
    } catch (err: any) {
      console.log("Error logging period:", err);
      Alert.alert(
        "Error",
        `An unexpected error occurred: ${err?.message || err}`
      );
    } finally {
      setLogging(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogPeriod}
      disabled={logging}
    >
      {logging ? (
        <ActivityIndicator size="small" color="#6658F5" />
      ) : (
        <Text style={styles.text}>Log Period +</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingVertical: 18,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 30,
    minWidth: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
});