import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function WaterProgressCard({
  waterIntake,
  targetWater,
  updating,
}: {
  waterIntake: number;
  targetWater: number;
  updating?: boolean;
}) {
  // Ensure we don't divide by zero and cap at 100%
  const target = targetWater || 8;
  const fillPercentage = Math.min(100, Math.max(0, (waterIntake / target) * 100));

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={220}
        width={14}
        fill={fillPercentage}
        tintColor="#56CCF2"
        backgroundColor="#DFF6FF"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.inner}>
            {updating ? (
              <ActivityIndicator size="large" color="#56CCF2" />
            ) : (
              <>
                <Text style={styles.amount}>{waterIntake}</Text>
                <Text style={styles.unit}>{waterIntake === 1 ? "Glass" : "Glasses"}</Text>
                <Text style={styles.goal}>of {target} Goal</Text>
              </>
            )}
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  inner: {
    justifyContent: "center",
    alignItems: "center",
  },
  amount: {
    fontSize: 44,
    fontWeight: "800",
    color: "#111",
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#56CCF2",
    textTransform: "uppercase",
    marginTop: 2,
  },
  goal: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
});