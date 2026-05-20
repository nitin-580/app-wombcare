import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  type Props = {
    title: string;
    text: string;
  };
  
  export default function InsightCard({
    title,
    text,
  }: Props) {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          {title}
        </Text>
  
        <Text style={styles.text}>
          {text}
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "white",
      borderRadius: 24,
      padding: 22,
      marginBottom: 18,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: "#111",
      marginBottom: 10,
    },
  
    text: {
      fontSize: 15,
      color: "#666",
      lineHeight: 24,
    },
  
  });