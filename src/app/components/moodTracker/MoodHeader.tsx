import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

const moods = [

  {
    label: "Happy",
    icon: "happy-outline",
  },

  {
    label: "Neutral",
    icon: "happy",
  },

  {
    label: "Sad",
    icon: "sad-outline",
  },

  {
    label: "Stressed",
    icon: "sad",
  },

];

export default function MoodTrackerCard() {

  const [selectedMood, setSelectedMood] =
    useState("Neutral");

  const [note, setNote] =
    useState("");

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <View style={styles.container}>

      {/* TITLE */}

      <Text style={styles.heading}>
        How are you feeling?
      </Text>

      {/* MOODS */}

      <View style={styles.moodRow}>

        {moods.map((mood, index) => {

          const active =
            selectedMood === mood.label;

          return (

            <TouchableOpacity

              key={index}

              style={[

                styles.moodCard,

                active &&
                  styles.activeMoodCard,
              ]}

              onPress={() =>
                setSelectedMood(
                  mood.label
                )
              }
            >

              <Ionicons
                name={mood.icon as any}
                size={34}
                color={
                  active
                    ? "white"
                    : "#4B4B5C"
                }
              />

              <Text
                style={[

                  styles.moodText,

                  active &&
                    styles.activeMoodText,
                ]}
              >

                {mood.label}

              </Text>

            </TouchableOpacity>

          );

        })}

      </View>

      {/* NOTE TITLE */}

      <Text style={styles.noteTitle}>
        ADD A NOTE
      </Text>

      {/* INPUT */}

      <TextInput

        multiline

        placeholder="Share your thoughts..."

        placeholderTextColor="#777"

        value={note}

        onChangeText={setNote}

        style={styles.input}
      />

      {/* BUTTON */}

      <TouchableOpacity style={styles.button}>

        <Text style={styles.buttonText}>
          Save Journal Entry
        </Text>

      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "#F8F6FD",

    borderRadius: 32,

    padding: 14,

    marginBottom: 30,
  },

  heading: {

    fontSize: 28,

    color: "#111",

    marginBottom: 28,

    fontFamily: "PoppinsSemiBold",
  },

  moodRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 15,
  },

  moodCard: {

    width: "23%",

    backgroundColor: "white",

    borderRadius: 24,

    paddingVertical: 14,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#F0EEF7",
  },

  activeMoodCard: {

    backgroundColor: "#6658F5",

    shadowColor: "#6658F5",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  moodText: {

    marginTop: 1,

    fontSize: 12,

    color: "#4B4B5C",

    fontFamily: "PoppinsSemiBold",
  },

  activeMoodText: {
    color: "white",
  },

  noteTitle: {

    fontSize: 16,

    letterSpacing: 1,

    color: "#4B4B5C",

    marginBottom: 14,

    fontFamily: "PoppinsBold",
  },

  input: {

    height: 160,

    backgroundColor: "white",

    borderRadius: 24,

    borderWidth: 1.5,
    borderColor: "#D9D3F2",

    padding: 22,

    fontSize: 16,

    color: "#111",

    textAlignVertical: "top",

    marginBottom: 34,

    fontFamily: "PoppinsRegular",
  },

  button: {

    height: 45,

    borderRadius: 36,

    backgroundColor: "#6658F5",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#6658F5",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonText: {

    color: "white",

    fontSize: 15,

    fontFamily: "PoppinsBold",
  },

});