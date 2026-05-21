import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import { useFonts } from "expo-font";
  
  const data = [
    40,
    70,
    92,
    58,
    80,
    64,
    98,
  ];
  
  const labels = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
  ];
  
  export default function EnergyLevelsCard() {
  
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    const maxHeight = 120;
  
    return (
  
      <View style={styles.card}>
  
        {/* HEADER */}
  
        <View style={styles.header}>
  
          <Text style={styles.title}>
            Energy Levels
          </Text>
  
          <Text style={styles.subtitle}>
            Last 7 Days
          </Text>
  
        </View>
  
        {/* GRAPH */}
  
        <View style={styles.graphContainer}>
  
          {data.map((value, index) => {
  
            const active =
              index === 2 || index === 6;
  
            return (
  
              <View
                key={index}
                style={styles.barWrapper}
              >
  
                <View
                  style={[
                    styles.bar,
  
                    {
                      height:
                        (value / 100) * maxHeight,
                    },
  
                    active && styles.activeBar,
                  ]}
                />
  
                <Text style={styles.label}>
                  {labels[index]}
                </Text>
  
              </View>
  
            );
  
          })}
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "white",
  
      borderRadius: 30,
  
      padding: 20,
  
      marginBottom: 24,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      marginBottom: 30,
    },
  
    title: {
      fontSize: 16,
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    subtitle: {
      fontSize: 10,
      color: "#666",
  
      fontFamily: "PoppinsSemiBold",
    },
  
    graphContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
  
    barWrapper: {
      alignItems: "center",
    },
  
    bar: {
      width: 25,
  
      backgroundColor: "#E8E3F3",
  
      borderRadius: 10,
    },
  
    activeBar: {
      backgroundColor: "#4F46E5",
    },
  
    label: {
      marginTop: 18,
  
      fontSize: 14,
      color: "#666",
  
      fontFamily: "PoppinsRegular",
    },
  
  });