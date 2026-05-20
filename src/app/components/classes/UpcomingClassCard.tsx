import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  
  export default function UpcomingClassCard() {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.badge}>
          LIVE IN 10 MIN
        </Text>
  
        <Text style={styles.title}>
          PCOS Yoga Session 🧘‍♀️
        </Text>
  
        <Text style={styles.instructor}>
          By Dr. Sarah Williams
        </Text>
  
        <TouchableOpacity style={styles.button}>
  
          <Text style={styles.buttonText}>
            Join Class
          </Text>
  
        </TouchableOpacity>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "#111",
  
      borderRadius: 30,
  
      padding: 26,
  
      marginBottom: 26,
    },
  
    badge: {
      color: "#FFB6C1",
      fontWeight: "700",
      marginBottom: 16,
    },
  
    title: {
      color: "white",
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 38,
    },
  
    instructor: {
      marginTop: 12,
      color: "#CCC",
      fontSize: 15,
    },
  
    button: {
      marginTop: 24,
  
      backgroundColor: "#FF4D8D",
  
      height: 54,
  
      borderRadius: 27,
  
      justifyContent: "center",
      alignItems: "center",
    },
  
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  
  });