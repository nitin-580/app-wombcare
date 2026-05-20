import { useFonts } from "expo-font";
import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {

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
              Forgot Password?
            </Text>

            <Text style={styles.subtitle}>
              Enter your registered email address and we’ll send you a password reset link.
            </Text>

            {/* EMAIL */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Email Address
              </Text>

              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#999"
                style={styles.input}
              />

            </View>

            {/* BUTTON */}

            <TouchableOpacity style={styles.button}>

              <Text style={styles.buttonText}>
                Send Reset Link
              </Text>

            </TouchableOpacity>

            {/* FOOTER */}

            <TouchableOpacity
              onPress={() => router.push("/")}
            >

              <Text style={styles.footerText}>

                Remember your password?

                <Text style={styles.loginText}>
                  {" "}Sign in
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
    marginBottom: 30,

    lineHeight: 24,

    fontFamily: "PoppinsRegular",
  },

  inputContainer: {
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontFamily: "PoppinsRegular",
  },

  input: {
    height: 58,

    borderWidth: 1,
    borderColor: "#EEE",

    borderRadius: 18,

    paddingHorizontal: 18,

    fontSize: 15,

    backgroundColor: "#FAFAFA",

    fontFamily: "PoppinsRegular",
  },

  button: {
    height: 60,

    backgroundColor: "#111",

    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },

  footerText: {
    marginTop: 28,
    textAlign: "center",
    color: "#777",
    fontFamily: "PoppinsRegular",
  },

  loginText: {
    color: "#FF4D8D",
    fontFamily: "PoppinsSemiBold",
  },

});