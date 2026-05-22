import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  export default function ProfileHeader() {
  
    return (
  
      <View style={styles.header}>
  
        <TouchableOpacity>
  
          <Ionicons
            name="arrow-back"
            size={28}
            color="#5B4CF0"
          />
  
        </TouchableOpacity>
  
        <Text style={styles.title}>
          Profile
        </Text>
  
        <TouchableOpacity>
  
          <Ionicons
            name="settings-outline"
            size={28}
            color="#5B4CF0"
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
  
      marginTop: 20,
  
      marginBottom: 30,
    },
  
    title: {
  
      fontSize: 28,
  
      color: "#5B4CF0",
  
      fontWeight: "700",
    },
  
  });