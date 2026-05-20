import {
    TouchableOpacity,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function SaveMoodButton() {
  
    return (
  
      <TouchableOpacity style={styles.button}>
  
        <Text style={styles.text}>
          Save Mood
        </Text>
  
      </TouchableOpacity>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    button: {
      height: 60,
  
      backgroundColor: "#111",
  
      borderRadius: 30,
  
      justifyContent: "center",
      alignItems: "center",
  
      marginBottom: 40,
    },
  
    text: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
  
  });