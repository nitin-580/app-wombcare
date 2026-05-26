import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import LegendRow from "./components/cycleTracker/LegendRow";
import LogPeriodButton from "./components/cycleTracker/LogPeriodButton";
import CycleLengthCard from "./components/cycleTracker/UpcomingPeriod";
import PeriodTrackerCalendarCard from "./components/cycleTracker/CalenderCard";

export default function CycleScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Automatically refresh when screen focused or navigated to
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BACKGROUND */}
      <View style={styles.topBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PeriodTrackerCalendarCard key={`calendar-${refreshKey}`} />

        <CycleLengthCard key={`length-${refreshKey}`} />

        <LegendRow />

        <LogPeriodButton onLog={handleRefresh} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FEFF",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 430,
    backgroundColor: "#E9F8FF",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
});