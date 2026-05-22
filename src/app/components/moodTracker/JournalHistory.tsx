import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

const journalData = [

  {
    id: 1,

    mood: "happy",

    date: "Oct 24, 2023",

    time: "09:45 AM",

    text:
      "Feeling very energized today after a good night’s sleep. Ready to tackle the...",
  },

  {
    id: 2,

    mood: "neutral",

    date: "Oct 23, 2023",

    time: "10:30 PM",

    text:
      "A bit tired but overall calm. Meditation helped a lot with focus.",
  },

  {
    id: 3,

    mood: "sad",

    date: "Oct 22, 2023",

    time: "04:15 PM",

    text:
      "Feeling some PMS symptoms and stress from work. Needed a break.",
  },

];

export default function JournalHistoryCard() {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  const getMoodIcon = (mood: string) => {

    switch (mood) {

      case "happy":
        return "happy";

      case "neutral":
        return "happy-outline";

      case "sad":
        return "sad";

      default:
        return "happy-outline";
    }

  };

  const getMoodColors = (mood: string) => {

    switch (mood) {

      case "happy":

        return {
          bg: "#E8E2FF",
          icon: "#6658F5",
        };

      case "neutral":

        return {
          bg: "#ECEAF3",
          icon: "#7B8191",
        };

      case "sad":

        return {
          bg: "#FFE2E2",
          icon: "#D93B3B",
        };

      default:

        return {
          bg: "#ECEAF3",
          icon: "#7B8191",
        };
    }

  };

  return (

    <View style={styles.container}>

      {/* TITLE */}

      <Text style={styles.heading}>
        Journal History
      </Text>

      {/* CARDS */}

      {journalData.map((item) => {

        const colors =
          getMoodColors(item.mood);

        return (

          <View
            key={item.id}
            style={styles.card}
          >

            {/* LEFT ICON */}

            <View
              style={[
                styles.iconContainer,

                {
                  backgroundColor:
                    colors.bg,
                },
              ]}
            >

              <Ionicons
                name={
                  getMoodIcon(
                    item.mood
                  ) as any
                }

                size={34}

                color={colors.icon}
              />

            </View>

            {/* CONTENT */}

            <View style={styles.content}>

              {/* TOP ROW */}

              <View style={styles.topRow}>

                <Text style={styles.date}>
                  {item.date}
                </Text>

                <Text style={styles.time}>
                  {item.time}
                </Text>

              </View>

              {/* DESCRIPTION */}

              <Text style={styles.description}>
                {item.text}
              </Text>

            </View>

          </View>

        );

      })}

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    marginBottom: 14,
  },

  heading: {

    fontSize: 24,

    color: "#111",

    marginBottom: 24,

    fontFamily: "PoppinsSemiBold",
  },

  card: {

    backgroundColor: "white",

    borderRadius: 30,

    padding: 14,

    flexDirection: "row",

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },

  iconContainer: {

    width: 66,
    height: 66,

    borderRadius: 33,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  content: {
    flex: 1,
  },

  topRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 10,
  },

  date: {

    fontSize: 14,

    color: "#111",

    fontFamily: "PoppinsSemiBold",
  },

  time: {

    fontSize: 14,

    color: "#555",

    fontFamily: "PoppinsSemiBold",
  },

  description: {

    fontSize: 12,

    lineHeight: 14,

    color: "#5B5B6B",

    fontFamily: "PoppinsRegular",
  },

});