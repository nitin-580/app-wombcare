import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import {
  LineChart,
} from "react-native-chart-kit";

import { useFonts } from "expo-font";

const screenWidth =
  Dimensions.get("window").width;

export default function MoodTrendGraph() {

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

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Mood Trend
        </Text>

        <Text style={styles.subtitle}>
          Last 7 Days
        </Text>

      </View>

      {/* GRAPH */}

      <LineChart

        data={{

          labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Today",
          ],

          datasets: [
            {
              data: [
                2,
                7,
                6,
                6,
                9,
                8,
                3,
              ],
            },
          ],
        }}

        width={screenWidth - 60}

        height={240}

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
            r: "6",
            strokeWidth: "4",
            stroke: "#6658F5",
          },

          propsForBackgroundLines: {
            stroke: "#E9E5F4",
            strokeWidth: 1,
          },

          propsForLabels: {
            fontSize: 13,
            fontFamily: "PoppinsRegular",
          },
        }}

        style={styles.chart}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "white",

    borderRadius: 34,

    paddingTop: 28,

    paddingHorizontal: 18,

    paddingBottom: 18,

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

    marginBottom: 10,
  },

  title: {

    fontSize: 24,

    color: "#111",

    fontFamily: "PoppinsSemiBold",
  },

  subtitle: {

    fontSize: 14,

    color: "#4B4B5C",

    fontFamily: "PoppinsSemiBold",
  },

  chart: {

    marginLeft: -26,

    borderRadius: 20,
  },

});