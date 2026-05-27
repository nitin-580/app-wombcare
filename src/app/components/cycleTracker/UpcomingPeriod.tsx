import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFonts } from "expo-font";

import { useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

type PeriodHistoryItem = {
  id: string;
  startDate: string;
  endDate: string;
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
  /* FETCH PERIOD HISTORY */
  /* ========================================= */

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
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          await response.json();

        console.log(
          "PERIOD HISTORY:",
          result
        );

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
          "PERIOD ERROR:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  /* ========================================= */
  /* DATE FORMATTER */
  /* ========================================= */

  const formatDate = (
    date: Date
  ) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ========================================= */
  /* CHECK PERIOD RANGE */
  /* ========================================= */

  const isPeriodDate = (
    currentDate: string
  ) => {
    for (const item of periodHistory) {
      if (!item.startDate)
        continue;

      const start =
        new Date(item.startDate);

      const end =
        item.endDate
          ? new Date(item.endDate)
          : new Date(item.startDate);

      start.setHours(
        0,
        0,
        0,
        0
      );

      end.setHours(
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

      if (
        current >= start &&
        current <= end
      ) {
        return true;
      }
    }

    return false;
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
              <View
                key={index}
                style={[
                  styles.dateCell,

                  isPeriod &&
                    styles.periodDate,
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
    height: 320,

    justifyContent:
      "center",

    alignItems: "center",
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
  },

  dateText: {
    fontSize: 15,

    color: "#111",

    fontFamily:
      "PoppinsRegular",
  },

  periodDate: {
    backgroundColor: "#7C3AED",

    borderRadius: 21,
  },

  periodText: {
    color: "#FFFFFF",

    fontFamily:
      "PoppinsSemiBold",
  },
});