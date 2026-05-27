import React, { useState } from "react";

import { useFonts } from "expo-font";

import { router } from "expo-router";

import AsyncStorage
from "@react-native-async-storage/async-storage";

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
  ActivityIndicator,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function LoginScreen() {

  /* ---------------- STATES ---------------- */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ---------------- FONTS ---------------- */

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {

    try {

      setIsLoading(true);

      setError("");

      const response = await fetch(

        "https://womb-care-backend-76858014616.us-central1.run.app/api/doctors/login",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,

            password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      if (!data.success) {

        setError(

          data.message ||

          "Invalid email or password"
        );

        return;
      }

      /* SAVE TOKEN */

      await AsyncStorage.setItem(

        "userToken",

        data.token
      );

      /* SAVE USER */

      await AsyncStorage.setItem(

        "userData",

        JSON.stringify(data.doctor)
      );

      /* SAVE ROLE */

      await AsyncStorage.setItem(

        "userRole",

        data.role || "user"
      );

      /* NAVIGATE */

      if (data.role === "doctor") {

        router.replace("/doctor");

      } else {

        router.replace("/(tabs)");

      }

    } catch (err) {

      console.log(err);

      setError(
        "Backend connection failed"
      );

    } finally {

      setIsLoading(false);
    }
  };

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

          {/* LOGIN CARD */}

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

                value={email}

                onChangeText={setEmail}

                autoCapitalize="none"

                keyboardType="email-address"
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

                  value={password}

                  onChangeText={setPassword}
                />

                <Ionicons
                  name="eye-off-outline"
                  size={22}
                  color="#999"
                />

              </View>

            </View>

            {/* FORGOT PASSWORD */}

            <TouchableOpacity

              onPress={() =>
                router.push(
                  "/(auth)/forgot-password"
                )
              }
            >

              <Text style={styles.forgotPassword}>
                Forgot Password?
              </Text>

            </TouchableOpacity>

            {/* ERROR */}

            {error ? (

              <Text style={styles.error}>
                {error}
              </Text>

            ) : null}

            {/* LOGIN BUTTON */}

            <TouchableOpacity

              style={styles.button}

              onPress={handleLogin}

              disabled={isLoading}
            >

              {isLoading ? (

                <ActivityIndicator
                  color="white"
                />

              ) : (

                <Text style={styles.buttonText}>
                  Sign In
                </Text>

              )}

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

              {/* GOOGLE */}

              <TouchableOpacity
                style={styles.socialButton}
              >

                <Ionicons
                  name="logo-google"
                  size={22}
                  color="#EA4335"
                />

                <Text style={styles.socialText}>
                  Google
                </Text>

              </TouchableOpacity>

              {/* APPLE */}

              <TouchableOpacity
                style={styles.socialButton}
              >

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

            {/* SIGNUP */}

            <TouchableOpacity

              onPress={() =>
                router.push(
                  "/(auth)/signup"
                )
              }
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

  error: {

    color: "#FF4D6D",

    marginBottom: 18,

    textAlign: "center",

    fontFamily: "PoppinsMedium",
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