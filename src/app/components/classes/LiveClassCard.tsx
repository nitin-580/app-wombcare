import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  export default function LiveClassCard() {
  
    return (
  
      <View style={styles.card}>
  
        <View style={styles.liveRow}>
  
          <View style={styles.liveDot} />
  
          <Text style={styles.liveText}>
            LIVE CLASS
          </Text>
  
        </View>
  
        <View style={styles.videoPlaceholder}>
  
          <Ionicons
            name="play-circle"
            size={70}
            color="white"
          />
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      marginBottom: 24,
    },
  
    liveRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
  
    liveDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "red",
      marginRight: 8,
    },
  
    liveText: {
      color: "#111",
      fontWeight: "700",
    },
  
    videoPlaceholder: {
      height: 220,
  
      backgroundColor: "#222",
  
      borderRadius: 28,
  
      justifyContent: "center",
      alignItems: "center",
    },
  
  });