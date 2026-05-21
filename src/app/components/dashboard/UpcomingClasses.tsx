import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
  } from "react-native";
  
  import { useFonts } from "expo-font";
  
  export default function UpcomingClassesCard() {
  
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
          Upcoming Classes
        </Text>
  
        {/* CARD */}
  
        <View style={styles.card}>
  
          {/* IMAGE */}
  
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3048/3048398.png",
            }}
            style={styles.image}
          />
  
          {/* CONTENT */}
  
          <View style={styles.content}>
  
            <Text style={styles.title}>
              Prenatal Yoga
            </Text>
  
            <Text style={styles.time}>
              Tomorrow, 10:00 AM
            </Text>
  
          </View>
  
          {/* BUTTON */}
  
          <TouchableOpacity style={styles.button}>
  
            <Text style={styles.buttonText}>
              Join
            </Text>
  
          </TouchableOpacity>
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginBottom: 24,
    },
  
    heading: {
      fontSize: 24,
      color: "#111",
  
      marginBottom: 18,
  
      fontFamily: "PoppinsBold",
    },
  
    card: {
      backgroundColor: "white",
  
      borderRadius: 28,
  
      padding: 18,
  
      flexDirection: "row",
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    image: {
      width: 92,
      height: 92,
  
      resizeMode: "contain",
    },
  
    content: {
      flex: 1,
  
      marginLeft: 14,
    },
  
    title: {
      fontSize: 18,
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    time: {
      marginTop: 4,
  
      fontSize: 15,
      color: "#666",
  
      fontFamily: "PoppinsRegular",
    },
  
    button: {
      backgroundColor: "#ECE8FA",
  
      paddingHorizontal: 20,
      paddingVertical: 10,
  
      borderRadius: 18,
    },
  
    buttonText: {
      fontSize: 15,
      color: "#6C63FF",
  
      fontFamily: "PoppinsSemiBold",
    },
  
  });