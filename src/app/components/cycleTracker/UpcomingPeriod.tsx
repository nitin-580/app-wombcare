import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import { useFonts } from "expo-font";
  
  export default function CycleLengthCard() {
  
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    const progress = 26;
    const totalDays = 28;
  
    const progressWidth =
      (progress / totalDays) * 100;
  
    return (
  
      <View style={styles.card}>
  
        {/* TOP SECTION */}
  
        <View style={styles.topSection}>
  
          {/* LEFT */}
  
          <View style={styles.leftSection}>
  
            <Text style={styles.heading}>
              Next period in 2 days
            </Text>
  
            <Text style={styles.subheading}>
              Your cycle is consistent
            </Text>
  
          </View>
  
          {/* RIGHT */}
  
          <View style={styles.rightSection}>
  
            <Text style={styles.cycleLabel}>
              CYCLE LENGTH
            </Text>
  
            <Text style={styles.daysText}>
              28 days
            </Text>
  
          </View>
  
        </View>
  
        {/* PROGRESS BAR */}
  
        <View style={styles.progressContainer}>
  
          {/* BACKGROUND */}
  
          <View style={styles.progressBackground}>
  
            {/* PERIOD PHASE */}
  
            <View style={styles.periodPhase} />
  
            {/* CURRENT PROGRESS */}
  
            <View
              style={[
                styles.progressFill,
  
                {
                  width: `${progressWidth}%`,
                },
              ]}
            />
  
            {/* TODAY INDICATOR */}
  
            <View
              style={[
                styles.todayDot,
  
                {
                  left: `${progressWidth - 3}%`,
                },
              ]}
            />
  
          </View>
  
        </View>
  
        {/* LABELS */}
  
        <View style={styles.labelsRow}>
  
          <Text style={styles.sideLabel}>
            Day 1
          </Text>
  
          <Text style={styles.todayLabel}>
            Today (Day 26)
          </Text>
  
          <Text style={styles.sideLabel}>
            Day 28
          </Text>
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "white",
      borderRadius: 34,
  
      padding: 20,
      marginBottom: 24,
      marginTop: 20,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    topSection: {
      flexDirection: "row",
      justifyContent: "space-between",
  
      marginBottom: 20,
    },
  
    leftSection: {
      flex: 1,
      paddingRight: 14,
    },
  
    heading: {
      fontSize: 20,
      lineHeight: 20,
  
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    subheading: {
      marginTop: 10,
  
      fontSize: 12,
      color: "#666",
  
      fontFamily: "PoppinsRegular",
    },
  
    rightSection: {
      alignItems: "flex-end",
    },
  
    cycleLabel: {
      fontSize: 10,
      letterSpacing: 1,
  
      color: "#888",
  
      marginBottom: 10,
  
      fontFamily: "PoppinsSemiBold",
    },
  
    daysText: {
      fontSize: 24,
      color: "#4F46E5",
  
      fontFamily: "PoppinsBold",
    },
  
    progressContainer: {
      marginBottom: 10,
    },
  
    progressBackground: {
      height: 20,
  
      borderRadius: 8,
  
      backgroundColor: "#ECE9F7",
  
      overflow: "hidden",
  
      position: "relative",
    },
  
    periodPhase: {
      position: "absolute",
  
      left: 0,
  
      width: "15%",
      height: "100%",
  
      backgroundColor: "#F8DDE6",
    },
  
    progressFill: {
      position: "absolute",
  
      left: 0,
  
      height: "100%",
  
      backgroundColor: "#D8D1FF",
    },
  
    todayDot: {
      position: "absolute",
  
      top: 2,
  
      width: 16,
      height: 16,
  
      borderRadius: 8,
  
      backgroundColor: "#4F46E5",
    },
  
    labelsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    sideLabel: {
      fontSize: 15,
      color: "#777",
  
      fontFamily: "PoppinsRegular",
    },
  
    todayLabel: {
      fontSize: 16,
      color: "#4F46E5",
      fontFamily: "PoppinsBold",
    },
  
  });