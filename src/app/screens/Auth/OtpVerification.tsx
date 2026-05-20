import { useFonts } from "expo-font";
import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function VerifyCodeScreen() {

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >

          {/* TOP SECTION */}

          <View style={styles.topSection}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >

              <Ionicons
                name="arrow-back"
                size={24}
                color="#111"
              />

            </TouchableOpacity>

            <Text style={styles.logo}>
              WombCare
            </Text>

          </View>

          {/* CARD */}

          <View style={styles.card}>

            <Text style={styles.title}>
              Verify Code
            </Text>

            <Text style={styles.subtitle}>
              Enter the 4-digit verification code sent to your email.
            </Text>

            {/* OTP INPUTS */}

            <View style={styles.codeContainer}>

              <TextInput
                maxLength={1}
                keyboardType="number-pad"
                style={styles.codeInput}
              />

              <TextInput
                maxLength={1}
                keyboardType="number-pad"
                style={styles.codeInput}
              />

              <TextInput
                maxLength={1}
                keyboardType="number-pad"
                style={styles.codeInput}
              />

              <TextInput
                maxLength={1}
                keyboardType="number-pad"
                style={styles.codeInput}
              />

            </View>

            {/* BUTTON */}

            <TouchableOpacity style={styles.button}>

              <Text style={styles.buttonText}>
                Verify Code
              </Text>

            </TouchableOpacity>

            {/* RESEND */}

            <TouchableOpacity>

              <Text style={styles.resendText}>

                Didn’t receive the code?

                <Text style={styles.resendHighlight}>
                  {" "}Resend
                </Text>

              </Text>

            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7E8EC",
  },

  topSection: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 24,

    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  logo: {
    fontSize: 40,
    color: "#FF4D8D",
    fontFamily: "PoppinsBold",
  },

  card: {
    flex: 1,
    backgroundColor: "white",

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,

    minHeight: 650,
  },

  title: {
    fontSize: 32,
    color: "#111",
    fontFamily: "PoppinsBold",
  },

  subtitle: {
    fontSize: 15,
    color: "#777",

    marginTop: 12,
    marginBottom: 40,

    lineHeight: 24,

    fontFamily: "PoppinsRegular",
  },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 40,
  },

  codeInput: {
    width: 70,
    height: 70,

    borderRadius: 22,

    backgroundColor: "#FAFAFA",

    borderWidth: 1,
    borderColor: "#EEE",

    textAlign: "center",

    fontSize: 28,
    color: "#111",

    fontFamily: "PoppinsBold",
  },

  button: {
    height: 60,

    backgroundColor: "#111",

    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },

  resendText: {
    marginTop: 28,

    textAlign: "center",

    color: "#777",

    fontFamily: "PoppinsRegular",
  },

  resendHighlight: {
    color: "#FF4D8D",
    fontFamily: "PoppinsSemiBold",
  },

});