import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useResponsive } from "../../../utils/responsive";

export default function MoodTrendGraph() {
  const { width: screenWidth } = useWindowDimensions();
  const { isTablet } = useResponsive();
  const chartWidth = isTablet ? Math.min(screenWidth - 120, 520) : screenWidth - 80;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  async function fetchHistory() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        // Sort ascending chronologically
        const sorted = [...result.data].sort(
          (a, b) => a.date.localeCompare(b.date)
        );
        setHistory(sorted);
      }
    } catch (err) {
      console.log("Error fetching mood history for graph:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  // Get last 7 days of logs
  const last7Days = history.slice(-7);

  // Fill in mock / placeholders if less than 7 days exist, to keep chart elegant
  const chartLabels: string[] = [];
  const chartData: number[] = [];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to convert mood string to value (2 to 10 scale)
  const getMoodValue = (moodStr?: string): number => {
    if (!moodStr) return 5; // Neutral baseline if empty
    const mood = moodStr.toLowerCase();
    if (mood === "happy") return 10;
    if (mood === "neutral" || mood === "calm") return 7;
    if (mood === "stressed") return 4;
    if (mood === "sad") return 2;
    return 5;
  };

  if (last7Days.length === 0) {
    // Elegant baseline placeholder
    chartLabels.push("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today");
    chartData.push(5, 5, 5, 5, 5, 5, 5);
  } else {
    last7Days.forEach((log) => {
      // Safely parse date substring to avoid timezone conversion shift
      let label = "Day";
      try {
        const cleanStr = log.date ? log.date.substring(0, 10) : "";
        const dateObj = new Date(cleanStr + "T00:00:00");
        const dayOfWeek = isNaN(dateObj.getDay()) ? 0 : dateObj.getDay();
        
        const isToday =
          new Date().toISOString().split("T")[0] === cleanStr;
        
        label = isToday ? "Today" : weekdays[dayOfWeek];
      } catch (e) {
        console.log("Error parsing graph date label:", e);
      }
      
      chartLabels.push(label);
      chartData.push(getMoodValue(log.mood));
    });

    // Pad to 7 items if less than 7 exist
    while (chartLabels.length < 7) {
      chartLabels.unshift("Day");
      chartData.unshift(5);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Trend</Text>
        <Text style={styles.subtitle}>Last 7 Days</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6658F5" />
        </View>
      ) : (
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={chartWidth}
          height={200}
          bezier
          withShadow={false}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: () => "#6658F5",
            labelColor: () => "#4B4B5C",
            propsForDots: {
              r: "5",
              strokeWidth: "3",
              stroke: "#6658F5",
            },
            propsForBackgroundLines: {
              stroke: "#E9E5F4",
              strokeWidth: 1,
            },
            propsForLabels: {
              fontSize: 11,
              fontFamily: "PoppinsRegular",
            },
          }}
          style={styles.chart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 34,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  subtitle: {
    fontSize: 12,
    color: "#4B4B5C",
    fontFamily: "PoppinsSemiBold",
  },
  chart: {
    marginLeft: -10,
    borderRadius: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});