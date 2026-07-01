import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";

import { useFonts } from "expo-font";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HistoryItem = {
  id: string;
  date: string;
  waterIntake: number;
  mood: string;
  sleep: number;
  cycleDay: number;
  symptoms: string[];
};

export default function EnergyLevelsCard() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<HistoryItem | null>(null);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const fetchHistory =
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

        /* ---------------- FETCH HISTORY ---------------- */

        const response =
          await fetch(

            `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/history`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          await response.json();

        console.log(
          "ENERGY HISTORY:",
          result
        );

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          const sorted = [...result.data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const last7Days = sorted.slice(-7);
          setHistory(last7Days);
        }

      } catch (err) {

        console.log(
          "HISTORY ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  /* ---------------- ENERGY CALCULATION ---------------- */

  const getEnergyScore =
    (item: HistoryItem) => {

      let score = 0;

      /* WATER */

      score +=
        Math.min(
          item.waterIntake * 8,
          30
        );

      /* SLEEP */

      score +=
        Math.min(
          item.sleep * 5,
          35
        );

      /* MOOD */

      const mood =
        item.mood?.toLowerCase();

      if (mood === "happy") {

        score += 25;

      } else if (
        mood === "calm"
      ) {

        score += 22;

      } else if (
        mood === "neutral"
      ) {

        score += 16;

      } else if (
        mood === "sad"
      ) {

        score += 8;

      } else {

        score += 12;
      }

      /* SYMPTOMS */

      score -=
        (item.symptoms?.length || 0) * 4;

      return Math.max(
        10,
        Math.min(
          100,
          Math.round(score)
        )
      );
    };

  const getEnergyLabel = (score: number) => {
    if (score >= 80) return "Vibrant";
    if (score >= 60) return "Steady";
    if (score >= 40) return "Moderate";
    return "Resting";
  };

  if (!fontsLoaded || loading) {

    return (

      <View style={styles.loaderContainer}>

        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

      </View>
    );
  }

  /* ---------------- NO DATA ---------------- */

  if (history.length === 0) {

    return (

      <View style={styles.card}>

        <View style={styles.header}>

          <Text style={styles.title}>
            Energy Levels
          </Text>

          <Text style={styles.subtitle}>
            Last 7 Days
          </Text>

        </View>

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyEmoji}>
            🌸
          </Text>

          <Text style={styles.emptyTitle}>
            No wellness history yet
          </Text>

          <Text style={styles.emptySubtitle}>

            Your daily wellness insights
            will appear here once tracking
            begins.

          </Text>

        </View>

      </View>
    );
  }

  const maxHeight = 120;

  const labels =
    history.map((item) => {

      const date =
        new Date(item.date);

      return date
        .toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        )
        .charAt(0);
    });

  return (

    <View style={styles.card}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Energy Levels
        </Text>

        <Text style={styles.subtitle}>
          Wellness History
        </Text>

      </View>

      {/* GRAPH */}

      <View style={styles.graphContainer}>

        {history.map(
          (item, index) => {

            const score =
              getEnergyScore(item);

            const active =
              score >= 80;

            return (

              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.barWrapper}
                onPress={() =>
                  setSelectedDay(item)
                }
              >

                <View
                  style={[

                    styles.bar,

                    {
                      height:
                        (score / 100) *
                        maxHeight,
                    },

                    active &&
                      styles.activeBar,
                  ]}
                />

                <Text style={styles.scoreText}>
                  {getEnergyLabel(score)}
                </Text>

                <Text style={styles.label}>
                  {labels[index]}
                </Text>

              </TouchableOpacity>
            );
          }
        )}

      </View>

      {/* MODAL */}

      <Modal
        visible={!!selectedDay}
        transparent
        animationType="fade"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Daily Wellness
            </Text>

            {selectedDay && (
              <>

                <Text style={styles.modalText}>
                  Mood: {selectedDay.mood}
                </Text>

                <Text style={styles.modalText}>
                  Sleep: {selectedDay.sleep} hrs
                </Text>

                <Text style={styles.modalText}>
                  Water: {selectedDay.waterIntake} glasses
                </Text>

                <Text style={styles.modalText}>
                  Cycle Day: {selectedDay.cycleDay}
                </Text>

                <Text style={styles.modalText}>
                  Symptoms:{" "}
                  {selectedDay.symptoms?.length
                    ? selectedDay.symptoms.join(", ")
                    : "None"}
                </Text>

                <Text style={styles.modalEnergy}>
                  Energy Level:{" "}
                  {getEnergyLabel(getEnergyScore(selectedDay))}
                </Text>

              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setSelectedDay(null)
              }
            >

              <Text style={styles.closeText}>
                Close
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {

    height: 220,

    justifyContent: "center",

    alignItems: "center",
  },

  card: {

    backgroundColor: "white",

    borderRadius: 30,

    padding: 20,

    marginBottom: 24,

    shadowColor: "#000",

    shadowOpacity: 0.03,

    shadowRadius: 10,

    elevation: 3,
  },

  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 30,
  },

  title: {

    fontSize: 16,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  subtitle: {

    fontSize: 10,

    color: "#666",

    fontFamily: "PoppinsSemiBold",
  },

  graphContainer: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-end",
  },

  barWrapper: {

    alignItems: "center",
  },

  bar: {

    width: 25,

    backgroundColor: "#E8E3F3",

    borderRadius: 10,
  },

  activeBar: {

    backgroundColor: "#4F46E5",
  },

  label: {

    marginTop: 12,

    fontSize: 14,

    color: "#666",

    fontFamily: "PoppinsRegular",
  },

  scoreText: {

    marginTop: 8,

    fontSize: 8,

    color: "#444",

    fontFamily: "PoppinsRegular",
  },

  emptyContainer: {

    height: 180,

    justifyContent: "center",

    alignItems: "center",
  },

  emptyEmoji: {

    fontSize: 42,

    marginBottom: 14,
  },

  emptyTitle: {

    fontSize: 18,

    color: "#111",

    marginBottom: 10,

    fontFamily: "PoppinsBold",
  },

  emptySubtitle: {

    fontSize: 14,

    color: "#777",

    textAlign: "center",

    lineHeight: 24,

    paddingHorizontal: 20,

    fontFamily: "PoppinsRegular",
  },

  modalOverlay: {

    flex: 1,

    backgroundColor:
      "rgba(0,0,0,0.4)",

    justifyContent: "center",

    alignItems: "center",
  },

  modalCard: {

    width: "85%",

    backgroundColor: "#fff",

    borderRadius: 24,

    padding: 24,
  },

  modalTitle: {

    fontSize: 20,

    marginBottom: 18,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  modalText: {

    fontSize: 15,

    marginBottom: 10,

    color: "#444",

    fontFamily: "PoppinsRegular",
  },

  modalEnergy: {

    marginTop: 12,

    fontSize: 18,

    color: "#4F46E5",

    fontFamily: "PoppinsBold",
  },

  closeButton: {

    marginTop: 20,

    backgroundColor: "#4F46E5",

    paddingVertical: 12,

    borderRadius: 14,

    alignItems: "center",
  },

  closeText: {

    color: "white",

    fontSize: 15,

    fontFamily: "PoppinsSemiBold",
  },

});