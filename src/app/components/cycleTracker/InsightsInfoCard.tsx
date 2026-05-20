import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  type Props = {
    title: string;
    value: string;
  };
  
  export default function InsightInfoCard({
    title,
    value,
  }: Props) {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          {title}
        </Text>
  
        <Text style={styles.value}>
          {value}
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "white",
  
      borderRadius: 24,
  
      padding: 22,
  
      marginBottom: 16,
  
      borderWidth: 1,
      borderColor: "#BEEFFF",
    },
  
    title: {
      fontSize: 16,
      color: "#555",
    },
  
    value: {
      marginTop: 12,
      fontSize: 24,
      fontWeight: "700",
      color: "#111",
    },
  
  });