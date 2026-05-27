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
  Alert,
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

export default function PeriodCalendar() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [loading, setLoading] =
    useState(true);

  const [periodHistory, setPeriodHistory] =
    useState<PeriodHistoryItem[]>([]);

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(today.getMonth());

  const [currentYear, setCurrentYear] =
    useState(today.getFullYear());

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
  /* VALID START DATE */
  /* ========================================= */

  const isValidStartDate = (
    dateString: string
  ) => {
    const selected =
      new Date(dateString);

    selected.setHours(
      0,
      0,
      0,
      0
    );

    const current =
      new Date();

    current.setHours(
      0,
      0,
      0,
      0
    );

    return (
      selected.getTime() <=
      current.getTime()
    );
  };

  /* ========================================= */
  /* PERIOD DATE CHECK */
  /* ========================================= */

  const isPeriodDate = (
    currentDate: string
  ) => {
    for (const item of periodHistory) {
      if (!item.startDate)
        continue;

      const start =
        new Date(item.startDate);

      start.setHours(
        0,
        0,
        0,
        0
      );

      const current =
        new Date(currentDate);

      current.setHours(
        0,
        0,
        0,
        0
      );

      // ONLY START DATE

      if (!item.endDate) {
        if (
          current.getTime() ===
          start.getTime()
        ) {
          return true;
        }

        continue;
      }

      // RANGE

      const end =
        new Date(item.endDate);

      end.setHours(
        0,
        0,
        0,
        0
      );

      if (
        current >= start &&
        current <= end
      ) {
        return true;
      }
    }

    return false;
  };

  /* ========================================= */
  /* START PERIOD */
  /* ========================================= */

  const logPeriodStart =
    async (
      selectedDate: string
    ) => {
      try {
        if (
          !isValidStartDate(
            selectedDate
          )
        ) {
          Alert.alert(
            "Invalid Date",
            "Future dates are not allowed."
          );

          return;
        }

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

        // CHECK DUPLICATE

        const existingPeriod =
          periodHistory.find(
            (item) =>
              item.startDate ===
              selectedDate
          );

        // PATCH EXISTING

        if (existingPeriod) {
          const response =
            await fetch(
              `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/period/history/${existingPeriod.id}`,
              {
                method: "PATCH",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body: JSON.stringify({
                  startDate:
                    selectedDate,
                }),
              }
            );

          const result =
            await response.json();

          if (result.success) {
            await fetchPeriodHistory();
          }

          return;
        }

        // CREATE NEW

        const response =
          await fetch(
            `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/period/start`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                startDate:
                  selectedDate,
              }),
            }
          );

        const result =
          await response.json();

        if (result.success) {
          await fetchPeriodHistory();
        }
      } catch (err) {
        console.log(
          "START ERROR:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  /* ========================================= */
  /* END PERIOD */
  /* ========================================= */

  const performLogPeriodEnd = async (cycleId: string, endDateStr: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}/period/history/${cycleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            endDate: endDateStr,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success 🌸", "Period cycle end date updated successfully!");
        await fetchPeriodHistory();
      } else {
        Alert.alert("Error", result.message || "Failed to update cycle.");
      }
    } catch (err) {
      console.log("PERFORM END ERROR:", err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const logPeriodEnd =
    async (
      selectedDate: string
    ) => {
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

        // FETCH RECENT 3 CYCLES FROM HISTORY (already sorted latest-first)
        const recentCycles = periodHistory.slice(0, 3);

        if (!recentCycles || recentCycles.length === 0) {
          Alert.alert(
            "No Period Found 🌸",
            "Please log a period start date first."
          );
          setLoading(false);
          return;
        }

        const buttons = recentCycles.map((cycle) => {
          const start = new Date(cycle.startDate);
          const monthName = start.toLocaleString('default', { month: 'long' });
          const day = start.getDate();
          return {
            text: `${monthName} ${day} Cycle`,
            onPress: () => performLogPeriodEnd(cycle.id, selectedDate)
          };
        });

        // Add Cancel option
        buttons.push({
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        } as any);

        setLoading(false);

        Alert.alert(
          "Select Period Cycle to End 🌸",
          `Which cycle would you like to set the end date of to ${selectedDate}?`,
          buttons
        );
      } catch (err) {
        console.log(
          "END ERROR:",
          err
        );
        setLoading(false);
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
          Updating your calendar...
        </Text>
      </View>
    );
  }

  /* ========================================= */
  /* CALENDAR */
  /* ========================================= */

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (
    let i = 1;
    i <= daysInMonth;
    i++
  ) {
    calendarDays.push(i);
  }

  return (
    <View style={styles.card}>
      {/* MONTH */}

      <View style={styles.monthRow}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);

              setCurrentYear(
                currentYear - 1
              );
            } else {
              setCurrentMonth(
                currentMonth - 1
              );
            }
          }}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {months[currentMonth]}{" "}
          {currentYear}
        </Text>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);

              setCurrentYear(
                currentYear + 1
              );
            } else {
              setCurrentMonth(
                currentMonth + 1
              );
            }
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#111"
          />
        </TouchableOpacity>
      </View>

      {/* WEEK DAYS */}

      <View style={styles.weekRow}>
        {weekDays.map(
          (day, index) => (
            <Text
              key={index}
              style={styles.weekDay}
            >
              {day}
            </Text>
          )
        )}
      </View>

      {/* CALENDAR */}

      <View style={styles.calendarContainer}>
        {calendarDays.map(
          (date, index) => {
            if (!date) {
              return (
                <View
                  key={index}
                  style={styles.dateCell}
                />
              );
            }

            const fullDate =
              `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(
                date
              ).padStart(2, "0")}`;

            const isPeriod =
              isPeriodDate(
                fullDate
              );

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedDate(
                    fullDate
                  );
                }}
                onLongPress={() => {
                  Alert.alert(
                    "Update Period",
                    fullDate,
                    [
                      {
                        text:
                          "Start Period",

                        onPress:
                          () =>
                            logPeriodStart(
                              fullDate
                            ),
                      },

                      {
                        text:
                          "End Period",

                        onPress:
                          () =>
                            logPeriodEnd(
                              fullDate
                            ),
                      },

                      {
                        text:
                          "Cancel",

                        style:
                          "cancel",
                      },
                    ]
                  );
                }}
                style={[
                  styles.dateCell,

                  isPeriod &&
                    styles.periodDate,

                  selectedDate ===
                    fullDate &&
                    styles.selectedDate,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,

                    isPeriod &&
                      styles.periodText,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    height: 320,

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

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 32,

    padding: 20,
  },

  monthRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 24,
  },

  arrowButton: {
    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: "#F5F3FF",

    justifyContent:
      "center",

    alignItems: "center",
  },

  monthText: {
    fontSize: 20,

    color: "#111",

    fontFamily:
      "PoppinsBold",
  },

  weekRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    marginBottom: 14,
  },

  weekDay: {
    width: 42,

    textAlign: "center",

    color: "#999",

    fontSize: 13,

    fontFamily:
      "PoppinsSemiBold",
  },

  calendarContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",
  },

  dateCell: {
    width: 42,

    height: 42,

    marginBottom: 14,

    justifyContent:
      "center",

    alignItems: "center",

    borderRadius: 21,
  },

  selectedDate: {
    borderWidth: 2,

    borderColor: "#111",
  },

  dateText: {
    fontSize: 15,

    color: "#111",

    fontFamily:
      "PoppinsRegular",
  },

  periodDate: {
    backgroundColor: "#7C3AED",
  },

  periodText: {
    color: "#FFFFFF",

    fontFamily:
      "PoppinsSemiBold",
  },
});