import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import MoodHeader from "./components/moodTracker/MoodHeader";
import MoodTrendGraph from "./components/moodTracker/Graph";
import JournalHistoryCard from "./components/moodTracker/JournalHistory";

export default function MoodScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Automatically refresh when the screen is focused / clicked into
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
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