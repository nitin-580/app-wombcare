import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

import AsyncStorage
  from "@react-native-async-storage/async-storage";

type HistoryItem = {

  id: string;

  date: string;

  waterIntake: number;

  mood: string;

  sleep: number;

  cycleDay?: number;

  symptoms: string[];
};

export default function FunctionalPeriodCalendar() {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  const [loading, setLoading] =
    useState(true);

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const [profile, setProfile] = useState<any>(null);

  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(today.getMonth());

  const [currentYear, setCurrentYear] =
    useState(today.getFullYear());

  const [selectedDate, setSelectedDate] =
    useState(today.getDate());

  /* ---------------- SETTINGS ---------------- */

  const PERIOD_LENGTH = 5;

  useEffect(() => {

    fetchHistory();
    const todayStr = new Date().toISOString().split("T")[0];
    AsyncStorage.setItem("selectedPeriodLogDate", todayStr);

  }, []);

  /* ---------------- FETCH HISTORY ---------------- */

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
          "CALENDAR HISTORY:",
          result
        );

        if (
          result.success &&
          Array.isArray(result.data)
        ) {

          setHistory(result.data);
        }

        // Fetch dynamic profile details
        const profileResponse = await fetch(
          `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const profileResult = await profileResponse.json();
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
        }

      } catch (err) {

        console.log(
          "CALENDAR ERROR:",
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
          color="#6C63FF"
        />

      </View>
    );
  }

  /* ---------------- MONTHS ---------------- */

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

  /* ---------------- CALENDAR ---------------- */

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

  /* ---------------- MONTH CONTROLS ---------------- */

  const goToPreviousMonth = () => {

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
  };

  const goToNextMonth = () => {

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
  };

  /* ---------------- ENERGY SCORE ---------------- */

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

        score += 20;

      } else if (
        mood === "neutral"
      ) {

        score += 14;

      } else {

        score += 8;
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

  /* ---------------- CYCLE PROJECTION LOGIC ---------------- */

  const getCycleDayForDate = (targetDateStr: string) => {
    const candidates: Date[] = [];
    
    // From history
    history.forEach(item => {
      if (item.cycleDay === 1) {
        const cleanDateStr = item.date.split("T")[0];
        candidates.push(new Date(cleanDateStr));
      }
    });
    
    // From live profile
    if (profile?.cycleStartDate) {
      const cleanStartDateStr = profile.cycleStartDate.split("T")[0];
      candidates.push(new Date(cleanStartDateStr));
    }
    
    // Fallback: calculate from current cycleDay
    if (profile?.cycleDay) {
      const fallbackStart = new Date();
      fallbackStart.setHours(0, 0, 0, 0);
      fallbackStart.setDate(fallbackStart.getDate() - (profile.cycleDay - 1));
      candidates.push(fallbackStart);
    }
    
    if (candidates.length === 0) {
      return 0;
    }
    
    candidates.sort((a, b) => a.getTime() - b.getTime());
    
    const targetClean = targetDateStr.split("T")[0];
    const targetTime = new Date(targetClean).getTime();
    
    let closestStart: Date | null = null;
    for (const candidate of candidates) {
      if (candidate.getTime() <= targetTime) {
        closestStart = candidate;
      }
    }
    
    if (!closestStart) {
      closestStart = candidates[0];
    }
    
    const diffTime = targetTime - closestStart.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const cycleLength = profile?.cycleLength || 28;
    
    let cycleDay = (diffDays % cycleLength) + 1;
    if (cycleDay <= 0) {
      cycleDay += cycleLength;
    }
    
    return cycleDay;
  };

  const handleSelectDate = async (date: number) => {
    setSelectedDate(date);
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    await AsyncStorage.setItem("selectedPeriodLogDate", fullDate);
  };

  const isDateInPeriodRange = (
    currentDate: string
  ) => {
    const cycleDay = getCycleDayForDate(currentDate);
    return cycleDay >= 1 && cycleDay <= PERIOD_LENGTH;
  };

  const isPeriodStartDate = (
    currentDate: string
  ) => {
    const cycleDay = getCycleDayForDate(currentDate);
    return cycleDay === 1;
  };

  const isPeriodEndDate = (
    currentDate: string
  ) => {
    const cycleDay = getCycleDayForDate(currentDate);
    return cycleDay === PERIOD_LENGTH;
  };

  /* ---------------- SELECTED DAY ---------------- */

  const selectedFullDate =

    `${currentYear}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${String(
      selectedDate
    ).padStart(2, "0")}`;

  const selectedHistory =
    history.find(

      (item) =>

        item.date === selectedFullDate

    );

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

            {selectedHistory?.cycleDay ||
              selectedDate}

          </Text>

        </View>

      </View>

      {/* MONTH */}

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

          {months[currentMonth]}{" "}
          {currentYear}

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

      {/* WEEK DAYS */}

      <View style={styles.weekRow}>

        {days.map(
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

            const historyItem =
              history.find(

                (item) =>
                  item.date ===
                  fullDate

              );

            const energy =
              historyItem
                ? getEnergyScore(
                  historyItem
                )
                : 0;

            const cycleDay =
              historyItem?.cycleDay ??
              0;

            /* ---------------- STATES ---------------- */

            const isSelected =
              date === selectedDate;

            const isPeriod =
              isDateInPeriodRange(
                fullDate
              );

            const isPeriodStart =
              isPeriodStartDate(
                fullDate
              );

            const isPeriodEnd =
              isPeriodEndDate(
                fullDate
              );

             const calculatedCycleDay = getCycleDayForDate(fullDate);

            const isFertile =
              calculatedCycleDay >= 10 &&
              calculatedCycleDay <= 16;

            const isOvulation =
              calculatedCycleDay === 14;

            const isLowDay =
              energy > 0 &&
              energy < 45;

            const isGoodDay =
              energy >= 75;

            return (

              <TouchableOpacity
                key={index}

                onPress={() =>
                  handleSelectDate(
                    date
                  )
                }

                style={[

                  styles.dateCell,

                  isSelected
                    ? styles.selectedDate
                    : null,

                  isPeriod
                    ? styles.periodDate
                    : null,

                  isPeriodStart
                    ? styles.periodStartDate
                    : null,

                  isPeriodEnd
                    ? styles.periodEndDate
                    : null,

                  isFertile
                    ? styles.fertileDate
                    : null,

                  isOvulation
                    ? styles.ovulationDate
                    : null,

                  isLowDay
                    ? styles.lowDay
                    : null,

                  isGoodDay
                    ? styles.goodDay
                    : null,
                ]}
              >

                <Text
                  style={[

                    styles.dateText,

                    (
                      isPeriod ||
                      isOvulation ||
                      isLowDay ||
                      isGoodDay
                    )
                      ? styles.activeDateText
                      : null,
                  ]}
                >

                  {date}

                </Text>

              </TouchableOpacity>
            );
          }
        )}

      </View>

      {/* INSIGHT CARD */}

      <View style={styles.infoCard}>

        <Text style={styles.infoTitle}>
          Daily Wellness Insight ✨
        </Text>

        {selectedHistory ? (

          <>

            <Text style={styles.infoText}>
              Mood:{" "}
              {selectedHistory.mood}
            </Text>

            <Text style={styles.infoText}>
              Sleep:{" "}
              {selectedHistory.sleep} hrs
            </Text>

            <Text style={styles.infoText}>
              Water Intake:{" "}
              {
                selectedHistory.waterIntake
              }
            </Text>

            <Text style={styles.infoText}>
              Symptoms:{" "}

              {selectedHistory
                .symptoms?.length
                ? selectedHistory.symptoms.join(
                  ", "
                )
                : "None"}

            </Text>

            <Text style={styles.energyText}>

              Energy Score:{" "}

              {getEnergyScore(
                selectedHistory
              )}

            </Text>

          </>

        ) : (

          <Text style={styles.infoText}>

            No wellness data available
            for this day.

          </Text>

        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {

    height: 350,

    justifyContent: "center",

    alignItems: "center",
  },

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

    borderRadius: 0,

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

    borderRadius: 21,
  },

  periodDate: {

    backgroundColor: "#FF5D8F",
  },

  periodStartDate: {

    borderTopLeftRadius: 21,

    borderBottomLeftRadius: 21,
  },

  periodEndDate: {

    borderTopRightRadius: 21,

    borderBottomRightRadius: 21,
  },

  fertileDate: {

    backgroundColor: "#FFE58F",

    borderRadius: 21,
  },

  ovulationDate: {

    backgroundColor: "#6C63FF",

    borderRadius: 21,
  },

  lowDay: {

    backgroundColor: "#FF8A8A",

    borderRadius: 21,
  },

  goodDay: {

    backgroundColor: "#43C97B",

    borderRadius: 21,
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

  energyText: {

    marginTop: 10,

    color: "#111",

    fontSize: 16,

    fontFamily: "PoppinsBold",
  },

});