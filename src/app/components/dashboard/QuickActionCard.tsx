import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  type Props = {
    title: string;
    icon: any;
    color: string;
  };
  
  export default function QuickActionCard({
    title,
    icon,
    color,
  }: Props) {
  
    return (
  
      <TouchableOpacity style={styles.card}>
  
        <Ionicons
          name={icon}
          size={28}
          color={color}
        />
  
        <Text style={styles.text}>
          {title}
        </Text>
  
      </TouchableOpacity>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      width: "48%",
      backgroundColor: "white",
  
      borderRadius: 24,
      paddingVertical: 26,
  
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
    },
  
    text: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: "600",
      color: "#111",
    },
  
  });