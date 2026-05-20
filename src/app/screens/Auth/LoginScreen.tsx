import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {

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

            <View style={styles.logoCircle}>
              <Ionicons
                name="heart"
                size={30}
                color="#FF4D8D"
              />
            </View>

            <Text style={styles.logo}>
              WombCare
            </Text>

            <Text style={styles.tagline}>
              AI Powered Women’s Health
            </Text>

          </View>

          {/* CARD */}

          <View style={styles.card}>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Sign in to continue your wellness journey
            </Text>

            {/* EMAIL */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Email
              </Text>

              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#999"
                style={styles.input}
              />

            </View>

            {/* PASSWORD */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Password
              </Text>

              <View style={styles.passwordContainer}>

                <TextInput
                  placeholder="********"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.passwordInput}
                />

                <Ionicons
                  name="eye-off-outline"
                  size={22}
                  color="#999"
                />

              </View>

            </View>

            {/* FORGOT PASSWORD */}

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}

            <TouchableOpacity style={styles.button}>

              <Text style={styles.buttonText}>
                Sign In
              </Text>

            </TouchableOpacity>

            {/* DIVIDER */}

            <View style={styles.dividerContainer}>

              <View style={styles.divider} />

              <Text style={styles.dividerText}>
                or continue with
              </Text>

              <View style={styles.divider} />

            </View>

            {/* SOCIAL BUTTONS */}

            <View style={styles.socialContainer}>

              <TouchableOpacity style={styles.socialButton}>

                <Ionicons
                  name="logo-google"
                  size={22}
                  color="#EA4335"
                />

                <Text style={styles.socialText}>
                  Google
                </Text>

              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>

                <Ionicons
                  name="logo-apple"
                  size={22}
                  color="#111"
                />

                <Text style={styles.socialText}>
                  Apple
                </Text>

              </TouchableOpacity>

            </View>

            {/* FOOTER */}


              <TouchableOpacity
  onPress={() => router.push("/signup")}
>
  <Text style={styles.footerText}>
    Don’t have an account?
    
    <Text style={styles.signupText}>
      {" "}Sign up
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
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  logo: {
    fontSize: 38,
    color: "#FF4D8D",
    marginTop: 16,
    fontFamily: "PoppinsBold",
  },

  tagline: {
    marginTop: 8,
    color: "#777",
    fontSize: 15,
    fontFamily: "PoppinsRegular",
  },

  card: {
    flex: 1,
    backgroundColor: "white",

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,

    minHeight: 700,
  },

  title: {
    fontSize: 32,
    color: "#111",
    fontFamily: "PoppinsBold",
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 24,
    fontFamily: "PoppinsRegular",
  },

  inputContainer: {
    marginBottom: 20,
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

  passwordContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 18,
    backgroundColor: "#FAFAFA",

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PoppinsRegular",
  },

  forgotPassword: {
    textAlign: "right",
    color: "#FF4D8D",
    marginBottom: 24,
    fontFamily: "PoppinsSemiBold",
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

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEE",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  socialButton: {
    flex: 1,
    height: 58,

    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 18,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  socialText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },

  footerText: {
    marginTop: 32,
    textAlign: "center",
    color: "#777",
    fontFamily: "PoppinsRegular",
  },

  signupText: {
    color: "#FF4D8D",
    fontFamily: "PoppinsSemiBold",
  },

});