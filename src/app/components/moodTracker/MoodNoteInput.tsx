import {
    View,
    Text,
    TextInput,
    StyleSheet,
  } from "react-native";
  
  export default function MoodNoteInput() {
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.label}>
          Journal Note ✨
        </Text>
  
        <TextInput
          multiline
          placeholder="Write how you feel today..."
          placeholderTextColor="#999"
          style={styles.input}
        />
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginBottom: 24,
    },
  
    label: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111",
      marginBottom: 14,
    },
  
    input: {
      height: 140,
  
      backgroundColor: "white",
  
      borderRadius: 24,
  
      padding: 18,
  
      textAlignVertical: "top",
  
      fontSize: 15,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
  });