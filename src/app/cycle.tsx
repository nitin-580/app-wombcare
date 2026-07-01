import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedicalDisclaimerModal from "./components/common/MedicalDisclaimerModal";

import LegendRow from "./components/cycleTracker/LegendRow";
import LogPeriodButton from "./components/cycleTracker/LogPeriodButton";
import CycleLengthCard from "./components/cycleTracker/UpcomingPeriod";
import PeriodTrackerCalendarCard from "./components/cycleTracker/CalenderCard";
import PeriodTimelineGraph from "./components/cycleTracker/PeriodCycleGraph";
import PeriodCalendar from "./components/cycleTracker/LogPeriodButton";
import PeriodMetricsCard from "./components/cycleTracker/CycleMetric";
import SkeletonLoader from "./components/common/SkeletonLoader";

export default function CycleScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Automatically refresh and show skeleton loader when screen focused or navigated to
  useFocusEffect(
    useCallback(() => {
      const checkDisclaimer = async () => {
        try {
          const accepted = await AsyncStorage.getItem("disclaimerAccepted");
          if (accepted !== "true") {
            setShowDisclaimer(true);
          }
        } catch (e) {
          console.error("Error checking disclaimer in cycle screen:", e);
        }
      };
      checkDisclaimer();

      setLoading(true);
      setRefreshKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SkeletonLoader preset="cycle" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* TOP BACKGROUND */}
      <View style={styles.topBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LogPeriodButton />

        <PeriodTimelineGraph />

        <PeriodMetricsCard />
        
      </ScrollView>
      <MedicalDisclaimerModal visible={showDisclaimer} onAccept={() => setShowDisclaimer(false)} />
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