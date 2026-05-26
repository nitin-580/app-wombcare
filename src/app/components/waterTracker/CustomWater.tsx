import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

interface CustomWaterProps {
  onAdd: (amount: number) => void;
  onSetTotal: (amount: number) => void;
  updating: boolean;
}

export default function CustomWaterInputButton({
  onAdd,
  onSetTotal,
  updating,
}: CustomWaterProps) {
  const [showInput, setShowInput] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD"); // ADD = add to total, EDIT = override total
  const [amount, setAmount] = useState("");

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    const glasses = parseInt(amount, 10);
    if (isNaN(glasses) || glasses < 0) {
      Alert.alert("Invalid Input", "Please enter a valid non-negative number of glasses.");
      return;
    }

    if (mode === "ADD") {
      onAdd(glasses);
    } else {
      onSetTotal(glasses);
    }

    setAmount("");
    setShowInput(false);
  };

  return (
    <View style={styles.container}>
      {/* BUTTONS (Add & Edit Side-by-Side) */}
      {!showInput && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setMode("ADD");
              setShowInput(true);
            }}
            disabled={updating}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Add Custom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setMode("EDIT");
              setShowInput(true);
            }}
            disabled={updating}
          >
            <Ionicons name="create-outline" size={24} color="#56CCF2" />
            <Text style={styles.editText}>Edit Intake</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* INPUT PANEL */}
      {showInput && (
        <View style={styles.inputContainer}>
          <Text style={styles.panelTitle}>
            {mode === "ADD" ? "Add Custom Glasses" : "Correct Current Intake"}
          </Text>

          <TextInput
            placeholder={
              mode === "ADD"
                ? "Enter glasses to add (e.g. 3)"
                : "Set current intake total (e.g. 5)"
            }
            placeholderTextColor="#B8B4D2"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowInput(false);
                setAmount("");
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    width: "48%",
    height: 64,
    borderRadius: 22,
    backgroundColor: "#56CCF2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#56CCF2",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  editButton: {
    width: "48%",
    height: 64,
    borderRadius: 22,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#56CCF2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  buttonText: {
    marginLeft: 6,
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  editText: {
    marginLeft: 6,
    color: "#56CCF2",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#DFF6FF",
  },
  panelTitle: {
    fontSize: 15,
    color: "#111",
    marginBottom: 10,
    fontFamily: "PoppinsBold",
  },
  input: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#F8FDFF",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111",
    marginBottom: 12,
    fontFamily: "PoppinsRegular",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    width: "48%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#ECEAF3",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "#7B8191",
    fontSize: 15,
    fontFamily: "PoppinsBold",
  },
  saveButton: {
    width: "48%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#56CCF2",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 15,
    fontFamily: "PoppinsBold",
  },
});