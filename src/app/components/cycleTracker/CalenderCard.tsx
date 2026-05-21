import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

export default function FunctionalPeriodCalendar() {

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(today.getMonth());

  const [currentYear, setCurrentYear] =
    useState(today.getFullYear());

  const [selectedDate, setSelectedDate] =
    useState(today.getDate());

  if (!fontsLoaded) {
    return null;
  }

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

  const days = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  // DAYS IN MONTH

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // FIRST DAY INDEX

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  // GENERATE CALENDAR

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // CHANGE MONTH

  const goToPreviousMonth = () => {

    if (currentMonth === 0) {

      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);

    } else {

      setCurrentMonth(currentMonth - 1);

    }

  };

  const goToNextMonth = () => {

    if (currentMonth === 11) {

      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);

    } else {

      setCurrentMonth(currentMonth + 1);

    }

  };

  return (

    <View style={styles.card}>

      {/* TOP */}

      <View style={styles.topRow}>

        <View>

          <Text style={styles.smallTitle}>
            PERIOD TRACKER
          </Text>

        </View>

        <View style={styles.dayBadge}>

          <Text style={styles.dayText}>
            Day
          </Text>

          <Text style={styles.dayNumber}>
            {selectedDate}
          </Text>

        </View>

      </View>

      {/* MONTH CONTROLS */}

      <View style={styles.monthRow}>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToPreviousMonth}
        >

          <Ionicons
            name="chevron-back"
            size={22}
            color="#111"
          />

        </TouchableOpacity>

        <Text style={styles.monthText}>

          {months[currentMonth]} {currentYear}

        </Text>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToNextMonth}
        >

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#111"
          />

        </TouchableOpacity>

      </View>

      {/* DAYS */}

      <View style={styles.weekRow}>

        {days.map((day, index) => (

          <Text
            key={index}
            style={styles.weekDay}
          >
            {day}
          </Text>

        ))}

      </View>

      {/* CALENDAR */}

      <View style={styles.calendarContainer}>

        {calendarDays.map((date, index) => {

          const isSelected =
            date === selectedDate;

          // EXAMPLE PERIOD DAYS

          const isPeriod =
            date === 6 ||
            date === 7 ||
            date === 8;

          const isFertile =
            date === 13 ||
            date === 14 ||
            date === 15;

          const isOvulation =
            date === 15;

          return (

            <TouchableOpacity
              key={index}

              disabled={!date}

              onPress={() => {

                if (date) {
                  setSelectedDate(date);
                }

              }}

              style={[

                styles.dateCell,

                isSelected &&
                  styles.selectedDate,

                isPeriod &&
                  styles.periodDate,

                isFertile &&
                  styles.fertileDate,

                isOvulation &&
                  styles.ovulationDate,
              ]}
            >

              <Text
                style={[

                  styles.dateText,

                  (
                    isSelected ||
                    isPeriod ||
                    isOvulation
                  ) &&
                    styles.activeDateText,
                ]}
              >

                {date || ""}

              </Text>

            </TouchableOpacity>

          );

        })}

      </View>

      {/* INFO */}

      <View style={styles.infoCard}>

        <Text style={styles.infoTitle}>
          Today's Cycle Insight ✨
        </Text>

        <Text style={styles.infoText}>
          Your fertile window is approaching. Stay hydrated and maintain healthy sleep.
        </Text>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "white",

    borderRadius: 32,

    padding: 15,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 24,
  },

  smallTitle: {
    color: "#6C63FF",

    fontSize: 13,
    letterSpacing: 1,

    marginBottom: 8,

    fontFamily: "PoppinsSemiBold",
  },

  heading: {
    fontSize: 28,
    color: "#111",

    fontFamily: "PoppinsBold",
  },

  dayBadge: {
    width: 82,
    height: 82,

    borderRadius: 24,

    backgroundColor: "#F4F2FF",

    justifyContent: "center",
    alignItems: "center",
  },

  dayText: {
    fontSize: 13,
    color: "#777",

    fontFamily: "PoppinsRegular",
  },

  dayNumber: {
    marginTop: 4,

    fontSize: 28,
    color: "#6C63FF",

    fontFamily: "PoppinsBold",
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 26,
  },

  arrowButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#F8F8FC",

    justifyContent: "center",
    alignItems: "center",
  },

  monthText: {
    fontSize: 20,
    color: "#111",

    fontFamily: "PoppinsBold",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 16,
  },

  weekDay: {
    width: 42,

    textAlign: "center",

    color: "#999",
    fontSize: 13,

    fontFamily: "PoppinsSemiBold",
  },

  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",
  },

  dateCell: {
    width: 42,
    height: 42,

    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 14,
  },

  dateText: {
    color: "#111",
    fontSize: 15,

    fontFamily: "PoppinsSemiBold",
  },

  selectedDate: {
    borderWidth: 2,
    borderColor: "#111",
  },

  periodDate: {
    backgroundColor: "#FF5D8F",
  },

  fertileDate: {
    backgroundColor: "#FFE58F",
  },

  ovulationDate: {
    backgroundColor: "#6C63FF",
  },

  activeDateText: {
    color: "white",
  },

  infoCard: {
    marginTop: 24,

    backgroundColor: "#F5F3FF",

    borderRadius: 22,

    padding: 20,
  },

  infoTitle: {
    color: "#6C63FF",
    fontSize: 16,

    marginBottom: 10,

    fontFamily: "PoppinsBold",
  },

  infoText: {
    color: "#666",
    lineHeight: 24,

    fontSize: 14,

    fontFamily: "PoppinsRegular",
  },

});