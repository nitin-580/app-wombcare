import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  
  import { useFonts } from "expo-font";
  
  import {
    useEffect,
    useState,
    useCallback,
  } from "react";
  
  import { useFocusEffect } from "expo-router";
  
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  type PeriodHistoryItem = {
    id: string;
    startDate: string;
    endDate: string;
  };
  
  export default function PeriodTimelineGraph() {
    const [loading, setLoading] =
      useState(true);
  
    const [history, setHistory] = useState<
      any[]
    >([]);
  
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    useFocusEffect(
      useCallback(() => {
        fetchPeriodHistory();
      }, [])
    );
  
    const fetchPeriodHistory =
      async () => {
        try {
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
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
          const result =
            await response.json();
  
          if (
            result.success &&
            Array.isArray(result.data)
          ) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const formatted = result.data
              .filter((item: PeriodHistoryItem) => {
                const start = new Date(item.startDate);
                return start >= sixMonthsAgo;
              })
              .map((item: PeriodHistoryItem) => {
                const start = new Date(item.startDate);
                const end = item.endDate ? new Date(item.endDate) : new Date();
                const days =
                  Math.ceil(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                  ) + 1;
                const month = start.toLocaleString("default", {
                  month: "short",
                });
                return {
                  id: item.id,
                  month,
                  days,
                  startDate: start,
                };
              });

            const sorted = formatted.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
            setHistory(sorted);
          }
        } catch (err) {
          console.log(
            "PERIOD HISTORY ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      };
  
    if (!fontsLoaded || loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#7C3AED"
          />
        </View>
      );
    }
  
    // NO DATA
  
    if (history.length === 0) {
      return null;
    }
  
    return (
      <View style={styles.card}>
        {/* HEADER */}
  
        <View style={styles.header}>
          <Text style={styles.title}>
            Period Timeline
          </Text>
  
          <Text style={styles.subtitle}>
            Monthly Cycle Graph
          </Text>
        </View>
  
        {/* GRAPH */}
  
        <View style={styles.graphContainer}>
          {history.map(
            (
              item: any,
              index: number
            ) => {
              const height =
                Math.min(
                  120,
                  item.days * 10
                );
  
              return (
                <View
                  key={item.id}
                  style={styles.barWrapper}
                >
                  {/* DAYS */}
  
                  <Text
                    style={styles.daysText}
                  >
                    {item.days}d
                  </Text>
  
                  {/* BAR */}
  
                  <View
                    style={[
                      styles.bar,
  
                      item.days > 7
                        ? styles.activeBar
                        : null,
  
                      {
                        height,
                      },
                    ]}
                  />
  
                  {/* MONTH */}
  
                  <Text
                    style={styles.monthText}
                  >
                    {item.month}
                  </Text>
                </View>
              );
            }
          )}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    loader: {
      height: 220,
      justifyContent: "center",
      alignItems: "center",
    },
  
    card: {
      backgroundColor: "#FFFFFF",
  
      borderRadius: 30,
  
      padding: 20,

      marginTop: 20,
  
      marginBottom: 24,
  
      shadowColor: "#000",
  
      shadowOpacity: 0.03,
  
      shadowRadius: 10,
  
      elevation: 3,
    },
  
    header: {
      flexDirection: "row",
  
      justifyContent:
        "space-between",
  
      alignItems: "center",
  
      marginBottom: 30,
    },
  
    title: {
      fontSize: 18,
  
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    subtitle: {
      fontSize: 11,
  
      color: "#666",
  
      fontFamily:
        "PoppinsSemiBold",
    },
  
    graphContainer: {
      flexDirection: "row",
  
      justifyContent:
        "space-between",
  
      alignItems: "flex-end",
  
      height: 170,
    },
  
    barWrapper: {
      alignItems: "center",
    },
  
    bar: {
      width: 28,
  
      backgroundColor: "#DDD6FE",
  
      borderRadius: 14,
    },
  
    activeBar: {
      backgroundColor: "#7C3AED",
    },
  
    daysText: {
      marginBottom: 10,
  
      fontSize: 11,
  
      color: "#7C3AED",
  
      fontFamily:
        "PoppinsSemiBold",
    },
  
    monthText: {
      marginTop: 12,
  
      fontSize: 12,
  
      color: "#666",
  
      fontFamily:
        "PoppinsRegular",
    },
  });