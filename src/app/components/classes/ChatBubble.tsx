import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  type Props = {
    message: string;
    sender: string;
  };
  
  export default function ChatBubble({
    message,
    sender,
  }: Props) {
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.sender}>
          {sender}
        </Text>
  
        <View style={styles.bubble}>
  
          <Text style={styles.message}>
            {message}
          </Text>
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginBottom: 18,
    },
  
    sender: {
      marginBottom: 8,
      color: "#666",
      fontWeight: "600",
    },
  
    bubble: {
      backgroundColor: "white",
  
      padding: 16,
  
      borderRadius: 22,
  
      alignSelf: "flex-start",
  
      maxWidth: "85%",
    },
  
    message: {
      fontSize: 15,
      color: "#111",
      lineHeight: 22,
    },
  
  });