import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const moods = [
  {
    label: "Happy",
    icon: "happy-outline",
  },
  {
    label: "Neutral",
    icon: "happy",
  },
  {
    label: "Sad",
    icon: "sad-outline",
  },
  {
    label: "Stressed",
    icon: "sad",
  },
];

export default function MoodTrackerCard({ onSave }: { onSave: () => void }) {
  const [selectedMood, setSelectedMood] = useState("Neutral");
  const [sleepHours, setSleepHours] = useState(7);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  // Fetch today's logged mood/note/sleep initially if they exist
  useEffect(() => {
    async function loadCurrentData() {
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
          const profile = result.data;
          // Set initial mood
          if (profile.mood) {
            const formatted =
              profile.mood.charAt(0).toUpperCase() + profile.mood.slice(1);
            setSelectedMood(formatted);
          }
          // Set initial symptoms
          const existingSymptoms = Array.isArray(profile.symptoms)
            ? profile.symptoms
            : [];
          
          // Note
          const existingNote = existingSymptoms.find(
            (s) => typeof s === "string" && s.startsWith("Note:")
          );
          if (existingNote) {
            setNote(existingNote.replace("Note: ", ""));
          }

          // Sleep
          const existingSleep = existingSymptoms.find(
            (s) => typeof s === "string" && s.startsWith("Sleep:")
          );
          if (existingSleep) {
            const parsedSleep = parseInt(existingSleep.replace("Sleep: ", ""), 10);
            if (!isNaN(parsedSleep)) {
              setSleepHours(parsedSleep);
            }
          }
        }
      } catch (err) {
        console.log("Error loading current mood data:", err);
      }
    }
    loadCurrentData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = async () => {
    try {
      setSaving(true);
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

      // 1. Fetch current profile to merge symptoms
      let existingSymptoms: string[] = [];
      try {
        const getProfileRes = await fetch(
          `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const profileResult = await getProfileRes.json();
        if (profileResult.success && profileResult.data) {
          existingSymptoms = Array.isArray(profileResult.data.symptoms)
            ? profileResult.data.symptoms
            : [];
        }
      } catch (e) {
        console.log("Error getting profile symptoms:", e);
      }

      // Filter out old notes and sleep logs, then push the new ones
      const cleanedSymptoms = existingSymptoms.filter(
        (s) => typeof s === "string" && !s.startsWith("Note:") && !s.startsWith("Sleep:")
      );
      if (note.trim()) {
        cleanedSymptoms.push(`Note: ${note.trim()}`);
      }
      cleanedSymptoms.push(`Sleep: ${sleepHours}`);

      // 2. PATCH profile
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mood: selectedMood.toLowerCase(),
            symptoms: cleanedSymptoms,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Your mood, sleep hours, and journal note have been saved!");
        onSave();
      } else {
        Alert.alert("Error", result.message || "Failed to save journal entry.");
      }
    } catch (err: any) {
      console.log("Error saving journal:", err);
      Alert.alert(
        "Error",
        `An unexpected error occurred: ${err?.message || err}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How are you feeling?</Text>

      <View style={styles.moodRow}>
        {moods.map((mood, index) => {
          const active = selectedMood === mood.label;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.moodCard, active && styles.activeMoodCard]}
              onPress={() => setSelectedMood(mood.label)}
            >
              <Ionicons
                name={mood.icon as any}
                size={34}
                color={active ? "white" : "#4B4B5C"}
              />
              <Text style={[styles.moodText, active && styles.activeMoodText]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SLEEP TRACKER SECTION */}
      <Text style={styles.sectionTitle}>SLEEP HOURS</Text>
      <View style={styles.sleepContainer}>
        <Text style={styles.sleepTitle}>Sleep Duration</Text>
        <View style={styles.sleepControls}>
          <TouchableOpacity
            style={styles.sleepButton}
            onPress={() => setSleepHours(prev => Math.max(0, prev - 1))}
          >
            <Ionicons name="remove" size={20} color="#6658F5" />
          </TouchableOpacity>
          
          <Text style={styles.sleepText}>{sleepHours} hrs</Text>

          <TouchableOpacity
            style={styles.sleepButton}
            onPress={() => setSleepHours(prev => Math.min(24, prev + 1))}
          >
            <Ionicons name="add" size={20} color="#6658F5" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.noteTitle}>ADD A NOTE</Text>

      <TextInput
        multiline
        placeholder="Share your thoughts..."
        placeholderTextColor="#777"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Save Journal Entry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F6FD",
    borderRadius: 32,
    padding: 20,
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    color: "#111",
    marginBottom: 20,
    fontFamily: "PoppinsSemiBold",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moodCard: {
    width: "23%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0EEF7",
  },
  activeMoodCard: {
    backgroundColor: "#6658F5",
    shadowColor: "#6658F5",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  moodText: {
    marginTop: 6,
    fontSize: 12,
    color: "#4B4B5C",
    fontFamily: "PoppinsSemiBold",
  },
  activeMoodText: {
    color: "white",
  },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#4B4B5C",
    marginBottom: 10,
    fontFamily: "PoppinsBold",
  },
  sleepContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EEF7",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  sleepTitle: {
    fontSize: 15,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  sleepControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  sleepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EEF7",
    justifyContent: "center",
    alignItems: "center",
  },
  sleepText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#6658F5",
    marginHorizontal: 16,
  },
  noteTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#4B4B5C",
    marginBottom: 10,
    fontFamily: "PoppinsBold",
  },
  input: {
    height: 120,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D9D3F2",
    padding: 16,
    fontSize: 15,
    color: "#111",
    textAlignVertical: "top",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6658F5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6658F5",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});