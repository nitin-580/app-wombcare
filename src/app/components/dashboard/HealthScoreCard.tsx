import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  AnimatedCircularProgress,
} from "react-native-circular-progress";

import { useFonts } from "expo-font";

import {
  useEffect,
  useState,
} from "react";

import AsyncStorage
from "@react-native-async-storage/async-storage";

type ProfileType = {

  cycleDay?: number;

  nextPeriodDate?: string;

  cycleStartDate?: string;

  isPeriodTrackerEnabled?: boolean;
};

export default function HealthScoreCard() {

  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState<ProfileType | null>(
      null
    );

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile =
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

          `https://womb-care-backend-76858014616.us-central1.run.app/api/profiles/${userId}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "PROFILE:",
        data
      );

      if (data.success) {

        setProfile(
          data.data
        );
      }

    } catch (err) {

      console.log(
        "PROFILE ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
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

  /* ---------------- DYNAMIC CYCLE DAY ---------------- */

  let currentCycleDay =
    profile?.cycleDay || 1;

  if (

    profile?.cycleStartDate &&

    profile?.isPeriodTrackerEnabled !== false

  ) {

    const start =
      new Date(
        profile.cycleStartDate
      );

    const today =
      new Date();

    const diffTime =
      Math.abs(

        today.getTime() -
        start.getTime()
      );

    const diffDays =
      Math.floor(

        diffTime /

        (1000 * 60 * 60 * 24)
      );

    currentCycleDay =
      Math.min(
        diffDays + 1,
        35
      );
  }

  /* ---------------- PERIOD STATUS ---------------- */

  const nextPeriod =
    profile?.nextPeriodDate ||

    "Not Available";

  const fillPercentage =
    Math.min(
      (currentCycleDay / 28) * 100,
      100
    );

  return (

    <View style={styles.card}>

      {/* LEFT */}

      <View style={styles.leftSection}>

        <Text style={styles.label}>
          CYCLE STATUS
        </Text>

        <Text style={styles.heading}>

          Day {currentCycleDay}
          {" "}of your cycle

        </Text>

        <Text style={styles.subtitle}>

          Expected {nextPeriod}

        </Text>

      </View>

      {/* RIGHT */}

      <AnimatedCircularProgress

        size={110}

        width={10}

        fill={fillPercentage}

        tintColor="#4F46E5"

        backgroundColor="#E5E7FF"

        rotation={220}

        lineCap="round"
      >

        {() => (

          <View style={styles.progressInner}>

            <Text style={styles.dayNumber}>
              {currentCycleDay}
            </Text>

            <Text style={styles.dayText}>
              Day
            </Text>

          </View>
        )}

      </AnimatedCircularProgress>

    </View>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {

    height: 180,

    justifyContent: "center",

    alignItems: "center",
  },

  card: {

    backgroundColor: "white",

    borderRadius: 28,

    padding: 24,

    marginBottom: 24,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 10,

    elevation: 3,
  },

  leftSection: {

    flex: 1,

    paddingRight: 16,
  },

  label: {

    fontSize: 14,

    color: "#4F46E5",

    letterSpacing: 1,

    marginBottom: 14,

    fontFamily: "PoppinsSemiBold",
  },

  heading: {

    fontSize: 24,

    lineHeight: 34,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  subtitle: {

    marginTop: 16,

    color: "#777",

    fontSize: 15,

    fontFamily: "PoppinsRegular",
  },

  progressInner: {

    justifyContent: "center",

    alignItems: "center",
  },

  dayNumber: {

    fontSize: 34,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  dayText: {

    marginTop: -4,

    fontSize: 14,

    color: "#777",

    fontFamily: "PoppinsRegular",
  },

});