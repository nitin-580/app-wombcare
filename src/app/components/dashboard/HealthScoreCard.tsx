import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    AnimatedCircularProgress,
  } from "react-native-circular-progress";
  
  import { useFonts } from "expo-font";
  
  export default function HealthScoreCard() {
  
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
  
      <View style={styles.card}>
  
        {/* LEFT SIDE */}
  
        <View style={styles.leftSection}>
  
          <Text style={styles.label}>
            CYCLE STATUS
          </Text>
  
          <Text style={styles.heading}>
            Next period in 2 days
          </Text>
  
          <Text style={styles.subtitle}>
            Expected Oct 24th
          </Text>
  
        </View>
  
        {/* RIGHT SIDE */}
  
        <AnimatedCircularProgress
          size={110}
          width={10}
          fill={85}
          tintColor="#4F46E5"
          backgroundColor="#E5E7FF"
          rotation={220}
          lineCap="round"
        >
  
          {() => (
  
            <View style={styles.progressInner}>
  
              <Text style={styles.dayNumber}>
                26
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