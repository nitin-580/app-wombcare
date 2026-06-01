import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import MoodHeader from "./components/moodTracker/MoodHeader";
import MoodTrendGraph from "./components/moodTracker/Graph";
import JournalHistoryCard from "./components/moodTracker/JournalHistory";

import SkeletonLoader from "./components/common/SkeletonLoader";

export default function MoodScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Automatically refresh and show skeleton when the screen is focused / clicked into
  useFocusEffect(
    useCallback(() => {
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
        <SkeletonLoader preset="mood" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <MoodHeader onSave={handleRefresh} />

        <MoodTrendGraph key={`graph-${refreshKey}`} />

        <JournalHistoryCard key={`journal-${refreshKey}`} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});