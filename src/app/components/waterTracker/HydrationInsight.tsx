import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HydrationInsight({
  waterIntake,
  targetWater,
}: {
  waterIntake: number;
  targetWater: number;
}) {
  const percent = targetWater > 0 ? (waterIntake / targetWater) * 100 : 0;

  let title = "Hydration Insight ✨";
  let advice =
    "Drinking enough water may help reduce fatigue and improve skin health.";

  if (percent >= 100) {
    title = "Excellent Hydration! 🌟";
    advice =
      "Fantastic job! You've fully reached your hydration goal today. Proper hydration maximizes energy, balances hormones, and promotes clear, radiant skin!";
  } else if (percent >= 50) {
    title = "Almost There! 💧";
    advice =
      "You're more than halfway to your target! Keep drinking to prevent mid-day fatigue, boost concentration, and assist your body's natural cycle functions.";
  } else {
    title = "Hydration Reminder 💙";
    advice =
      "Start sipping! Drinking water regularly helps ease menstrual bloating, reduces cramps, and keeps you feeling refreshed. Keep your favorite glass handy!";
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{advice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EAF9FF",
    borderRadius: 26,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
  },
});