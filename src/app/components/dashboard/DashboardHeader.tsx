import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  export default function DashboardHeader() {
  
    return (
  
      <View style={styles.header}>
  
        <View>
  
          <Text style={styles.welcome}>
            Welcome Back 👋
          </Text>
  
          <Text style={styles.name}>
            Nitin
          </Text>
  
        </View>
  
        <TouchableOpacity style={styles.profileButton}>
  
          <Ionicons
            name="person"
            size={22}
            color="#111"
          />
  
        </TouchableOpacity>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      marginTop: 70,
      marginBottom: 30,
    },
  
    welcome: {
      fontSize: 16,
      color: "#777",
    },
  
    name: {
      fontSize: 32,
      fontWeight: "700",
      color: "#111",
      marginTop: 4,
    },
  
    profileButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "white",
  
      justifyContent: "center",
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
    },
  
  });