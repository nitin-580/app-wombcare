import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  export default function ChatInput() {
  
    return (
  
      <View style={styles.container}>
  
        <TextInput
          placeholder="Send a message..."
          placeholderTextColor="#999"
          style={styles.input}
        />
  
        <TouchableOpacity style={styles.sendButton}>
  
          <Ionicons
            name="send"
            size={20}
            color="white"
          />
  
        </TouchableOpacity>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      alignItems: "center",
  
      backgroundColor: "white",
  
      borderRadius: 30,
  
      padding: 8,
  
      marginTop: 20,
      marginBottom: 40,
    },
  
    input: {
      flex: 1,
      paddingHorizontal: 16,
      fontSize: 15,
    },
  
    sendButton: {
      width: 46,
      height: 46,
  
      borderRadius: 23,
  
      backgroundColor: "#FF4D8D",
  
      justifyContent: "center",
      alignItems: "center",
    },
  
  });