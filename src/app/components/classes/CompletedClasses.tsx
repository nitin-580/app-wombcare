import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  
  const completed = [
  
    {
      title: "Breathing Techniques",
      date: "Oct 21, 2023",
    },
  
    {
      title: "Pelvic Floor Health",
      date: "Oct 15, 2023",
    },
  
    {
      title: "Newborn Care 101",
      date: "Oct 08, 2023",
    },
  
  ];
  
  export default function CompletedClasses() {
  
    const [fontsLoaded] = useFonts({
  
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
  
      PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),
  
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.heading}>
          Completed
        </Text>
  
        <View style={styles.card}>
  
          {completed.map((item, index) => (
  
            <View
              key={index}
              style={styles.row}
            >
  
              <View>
  
                <Text style={styles.title}>
                  {item.title}
                </Text>
  
                <Text style={styles.date}>
                  {item.date}
                </Text>
  
              </View>
  
              <View style={styles.watchRow}>
  
                <Text style={styles.watch}>
                  Watch Recap
                </Text>
  
                <Ionicons
                  name="play-circle-outline"
                  size={22}
                  color="#5B4CF0"
                />
  
              </View>
  
            </View>
  
          ))}
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginBottom: 40,
    },
  
    heading: {
  
      fontSize: 30,
  
      color: "#111",
  
      marginBottom: 20,
  
      fontFamily: "PoppinsBold",
    },
  
    card: {
  
      backgroundColor: "white",
  
      borderRadius: 30,
  
      overflow: "hidden",
    },
  
    row: {
  
      flexDirection: "row",
  
      justifyContent: "space-between",
  
      alignItems: "center",
  
      padding: 22,
  
      borderBottomWidth: 1,
      borderBottomColor: "#F2F0F8",
    },
  
    title: {
  
      fontSize: 16,
  
      color: "#111",
  
      marginBottom: 8,
  
      fontFamily: "PoppinsSemiBold",
    },
  
    date: {
  
      fontSize: 12,
  
      color: "#666",
  
      fontFamily: "PoppinsRegular",
    },
  
    watchRow: {
  
      flexDirection: "row",
  
      alignItems: "center",
    },
  
    watch: {
  
      color: "#5B4CF0",
  
      fontSize: 15,
  
      marginRight: 6,
  
      fontFamily: "PoppinsSemiBold",
    },
  
  });