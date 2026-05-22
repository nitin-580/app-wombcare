import {
    TouchableOpacity,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  export default function LogoutButton() {
  
    return (
  
      <TouchableOpacity style={styles.button}>
  
        <Ionicons
          name="log-out-outline"
          size={26}
          color="#555"
        />
  
        <Text style={styles.text}>
          Logout
        </Text>
  
      </TouchableOpacity>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    button: {
  
      height: 76,
  
      borderWidth: 1.5,
      borderColor: "#D9D5F0",
  
      borderRadius: 24,
  
      flexDirection: "row",
  
      justifyContent: "center",
      alignItems: "center",
  
      marginBottom: 40,
    },
  
    text: {
  
      marginLeft: 14,
  
      fontSize: 24,
  
      color: "#444",
  
      fontWeight: "600",
    },
  
  });