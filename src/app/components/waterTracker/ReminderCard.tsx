import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReminderCard({
  waterIntake,
  targetWater,
}: {
  waterIntake: number;
  targetWater: number;
}) {
  const isGoalMet = waterIntake >= targetWater;

  // Dynamically calculate the next reminder time (2 hours from now)
  const now = new Date();
  const nextReminder = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const formattedTime = nextReminder.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {isGoalMet ? "Status ⏰" : "Next Reminder ⏰"}
      </Text>

      <Text style={[styles.time, isGoalMet && styles.goalMetColor]}>
        {isGoalMet ? "Goal Met! 🎉" : formattedTime}
      </Text>

      <Text style={styles.subtitle}>
        {isGoalMet
          ? "You've successfully completed your hydration targets for today! Stay awesome! 💛"
          : "Keep it up! Time to schedule your next glass of water and stay balanced 💙"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 26,
    padding: 24,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  time: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "800",
    color: "#56CCF2",
  },
  goalMetColor: {
    color: "#2ECC71",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});