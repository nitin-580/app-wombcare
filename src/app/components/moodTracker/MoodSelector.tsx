import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "🥺", label: "Emotional" },
    { emoji: "😡", label: "Irritated" },
    { emoji: "😴", label: "Tired" },
  ];
  
  export default function MoodSelector() {
  
    return (
  
      <View style={styles.container}>
  
        {moods.map((mood, index) => (
  
          <TouchableOpacity
            key={index}
            style={styles.card}
          >
  
            <Text style={styles.emoji}>
              {mood.emoji}
            </Text>
  
            <Text style={styles.label}>
              {mood.label}
            </Text>
  
          </TouchableOpacity>
  
        ))}
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 30,
    },
  
    card: {
      width: "48%",
  
      backgroundColor: "white",
  
      borderRadius: 24,
  
      paddingVertical: 24,
  
      alignItems: "center",
  
      marginBottom: 16,
  
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
    },
  
    emoji: {
      fontSize: 38,
    },
  
    label: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "600",
      color: "#111",
    },
  
  });