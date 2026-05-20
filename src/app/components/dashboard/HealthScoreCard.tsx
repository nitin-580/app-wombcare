import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function HealthScoreCard() {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          Health Score
        </Text>
  
        <Text style={styles.score}>
          86%
        </Text>
  
        <Text style={styles.subtitle}>
          Your hormonal health is improving
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "#FF4D8D",
      borderRadius: 30,
      padding: 28,
      marginBottom: 30,
    },
  
    title: {
      color: "white",
      fontSize: 18,
    },
  
    score: {
      color: "white",
      fontSize: 52,
      fontWeight: "700",
      marginTop: 12,
    },
  
    subtitle: {
      color: "white",
      marginTop: 10,
      fontSize: 15,
      lineHeight: 24,
    },
  
  });