import React, {
    useState,
    useCallback,
  } from "react";
  
  import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Share,
    ScrollView,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  
  import { useFocusEffect } from "expo-router";
  
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  type PeriodHistoryItem = {
    id: string;
    startDate: string;
    endDate?: string;
  };
  
  export default function PeriodMetricsCard() {
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
  
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    const [loading, setLoading] =
      useState(true);
  
    const [periodHistory, setPeriodHistory] =
      useState<PeriodHistoryItem[]>([]);
  
    useFocusEffect(
      useCallback(() => {
        fetchPeriodHistory();
      }, [])
    );
  
    /* ========================================= */
    /* FETCH HISTORY */
    /* ========================================= */
  
    const fetchPeriodHistory =
      async () => {
        try {
          setLoading(true);
  
          const token =
            await AsyncStorage.getItem(
              "userToken"
            );
  
          const userData =
            await AsyncStorage.getItem(
              "userData"
            );
  
          if (!userData) return;
  
          const parsed =
            JSON.parse(userData);
  
          const userId =
            parsed.id ||
            parsed._id;
  
          const response =
            await fetch(
              `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/period/history`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );
  
          const result =
            await response.json();
  
          if (
            result.success &&
            Array.isArray(result.data)
          ) {
            setPeriodHistory(
              result.data
            );
          }
        } catch (err) {
          console.log(
            "FETCH ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      };
  
    /* ========================================= */
    /* CALCULATE METRICS */
    /* ========================================= */
  
    const calculateMetrics = () => {
      if (
        !periodHistory ||
        periodHistory.length === 0
      ) {
        return {
          avgPeriodDays: null,
          avgCycleGap: null,
          totalCycles: 0,
        };
      }
  
      // AVG PERIOD LENGTH
  
      const periodLengths =
        periodHistory
          .filter(
            (item) =>
              item.startDate
          )
          .map((item) => {
            const start =
              new Date(
                item.startDate
              );
  
            const end =
              new Date(
                item.endDate ||
                  item.startDate
              );
  
            return (
              Math.ceil(
                (end.getTime() -
                  start.getTime()) /
                  (1000 *
                    60 *
                    60 *
                    24)
              ) + 1
            );
          });
  
      const avgPeriodDays =
        periodLengths.length > 0
          ? (
              periodLengths.reduce(
                (a, b) => a + b,
                0
              ) /
              periodLengths.length
            ).toFixed(1)
          : null;
  
      // AVG CYCLE GAP
  
      const sorted =
        [...periodHistory].sort(
          (a, b) =>
            new Date(
              a.startDate
            ).getTime() -
            new Date(
              b.startDate
            ).getTime()
        );
  
      const cycleGaps =
        [];
  
      for (
        let i = 1;
        i < sorted.length;
        i++
      ) {
        const previous =
          new Date(
            sorted[i - 1]
              .startDate
          );
  
        const current =
          new Date(
            sorted[i]
              .startDate
          );
  
        const gap =
          Math.ceil(
            (current.getTime() -
              previous.getTime()) /
              (1000 *
                60 *
                60 *
                24)
          );
  
        cycleGaps.push(gap);
      }
  
      const avgCycleGap =
        cycleGaps.length > 0
          ? (
              cycleGaps.reduce(
                (a, b) => a + b,
                0
              ) /
              cycleGaps.length
            ).toFixed(1)
          : null;
  
      return {
        avgPeriodDays,
        avgCycleGap,
  
        totalCycles:
          periodHistory.length,
      };
    };
  
    const metrics =
      calculateMetrics();
  
    /* ========================================= */
    /* SHARE REPORT */
    /* ========================================= */
  
    const shareReport =
      async () => {
        try {
          await Share.share({
            message: `
  WombCare Cycle Report
  
  Average Period:
  ${metrics.avgPeriodDays || "--"} days
  
  Average Cycle:
  ${metrics.avgCycleGap || "--"} days
  
  Cycles Logged:
  ${metrics.totalCycles}
  
  Generated from WombCare
            `,
          });
        } catch (err) {
          console.log(err);
        }
      };
  
    /* ========================================= */
    /* LOADER */
    /* ========================================= */
  
    if (!fontsLoaded || loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#7C3AED"
          />
  
          <Text style={styles.loadingText}>
            Loading your insights...
          </Text>
        </View>
      );
    }
  
    return (
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={
            styles.metricsContainer
          }
        >
          {/* AVG PERIOD */}
  
          <View
            style={styles.metricCard}
          >
            <Text
              style={
                styles.metricLabel
              }
            >
              Avg Period
            </Text>
  
            <Text
              style={
                styles.metricValue
              }
            >
              {metrics.avgPeriodDays
                ? `${metrics.avgPeriodDays}d`
                : "--"}
            </Text>
  
            <Text
              style={
                styles.metricSubtext
              }
            >
              {metrics.avgPeriodDays
                ? "Average bleeding duration"
                : "Track your cycles to unlock insights"}
            </Text>
          </View>
  
          {/* AVG CYCLE */}
  
          <View
            style={styles.metricCard}
          >
            <Text
              style={
                styles.metricLabel
              }
            >
              Avg Cycle
            </Text>
  
            <Text
              style={
                styles.metricValue
              }
            >
              {metrics.avgCycleGap
                ? `${metrics.avgCycleGap}d`
                : "--"}
            </Text>
  
            <Text
              style={
                styles.metricSubtext
              }
            >
              {metrics.avgCycleGap
                ? "Average gap between periods"
                : "Your cycle pattern will appear here"}
            </Text>
          </View>
  
          {/* TOTAL CYCLES */}
  
          <View
            style={styles.metricCard}
          >
            <Text
              style={
                styles.metricLabel
              }
            >
              Cycles Logged
            </Text>
  
            <Text
              style={
                styles.metricValue
              }
            >
              {
                metrics.totalCycles
              }
            </Text>
  
            <Text
              style={
                styles.metricSubtext
              }
            >
              {metrics.totalCycles >
              0
                ? "Your tracking history"
                : "No cycles tracked yet"}
            </Text>
          </View>
  
          {/* SHARE */}
  
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              shareReport
            }
            style={
              styles.shareCard
            }
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color="#7C3AED"
            />
  
            <Text
              style={
                styles.shareText
              }
            >
              Share Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    loader: {
      height: 300,
  
      justifyContent:
        "center",
  
      alignItems: "center",
    },
  
    loadingText: {
      marginTop: 14,
  
      fontSize: 14,
  
      color: "#777",
  
      fontFamily:
        "PoppinsRegular",
    },
  
    metricsContainer: {
      marginBottom: 40,
    },
  
    metricCard: {
      backgroundColor: "#FFFFFF",
  
      borderRadius: 28,
  
      padding: 20,
  
      marginBottom: 14,
    },
  
    metricLabel: {
      fontSize: 13,
  
      color: "#777",
  
      fontFamily:
        "PoppinsSemiBold",
    },
  
    metricValue: {
      marginTop: 8,
  
      fontSize: 34,
  
      color: "#111",
  
      fontFamily:
        "PoppinsBold",
    },
  
    metricSubtext: {
      marginTop: 6,
  
      fontSize: 12,
  
      lineHeight: 20,
  
      color: "#888",
  
      fontFamily:
        "PoppinsRegular",
    },
  
    shareCard: {
      height: 60,
  
      borderRadius: 24,
  
      backgroundColor: "#F5F3FF",
  
      flexDirection: "row",
  
      alignItems: "center",
  
      justifyContent:
        "center",
  
      marginTop: 6,
    },
  
    shareText: {
      marginLeft: 10,
  
      fontSize: 15,
  
      color: "#7C3AED",
  
      fontFamily:
        "PoppinsSemiBold",
    },
  });