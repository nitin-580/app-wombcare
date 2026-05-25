import React, { useState } from "react";

import { useFonts } from "expo-font";

import { router } from "expo-router";

import OnboardingScreen from "@/app/personalForm";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";


export default function SignupScreen() {

  /* ---------------- STATES ---------------- */

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  /* ---------------- FONTS ---------------- */

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async () => {

    try {

      setError("");

      setSuccess("");

      if (
        password !== confirmPassword
      ) {

        setError(
          "Passwords do not match"
        );

        return;
      }

      setIsLoading(true);

      const response = await fetch(

        "https://womb-care-backend-76858014616.us-central1.run.app/api/doctors/signup",

        {

          method: "POST",

          headers: {

            Accept:
              "application/json",

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name,

            email,

            phone,

            password,
          }),
        }
      );

      const text =
        await response.text();

      console.log(
        "RAW RESPONSE:",
        text
      );

      const data =
        JSON.parse(text);

      console.log(data);

      if (!data.success) {

        setError(
          data.message ||
          "Signup failed"
        );

        return;
      }

      /* SAVE USER */

      if (data.token) {

        await AsyncStorage.setItem(
          "userToken",
          data.token
        );
      }

      if (data.doctor) {

        await AsyncStorage.setItem(

          "userData",

          JSON.stringify(
            data.doctor
          )
        );
      }

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {

        router.replace("/personalForm");

      }, 1500);

    } catch (err: any) {

      console.log(err);

      setError(
        err.message ||
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

          {/* TOP */}

          <View style={styles.topSection}>

            <Text style={styles.logo}>
              WombCare
            </Text>

          </View>

          {/* CARD */}

          <View style={styles.card}>

            <Text style={styles.title}>
              Sign up
            </Text>

            <Text style={styles.subtitle}>
              Create your healthcare account
            </Text>

            {/* FULL NAME */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Full Name
              </Text>

              <TextInput

                placeholder="Nitin Kumar"

                placeholderTextColor="#999"

                style={styles.input}

                value={name}

                onChangeText={setName}
              />

            </View>

            {/* PHONE */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Phone Number
              </Text>

              <TextInput

                placeholder="+91 XXXXX XXXXX"

                placeholderTextColor="#999"

                keyboardType="phone-pad"

                style={styles.input}

                value={phone}

                onChangeText={setPhone}
              />

            </View>

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
              />

            </View>

            {/* PASSWORD */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Password
              </Text>

              <TextInput

                placeholder="********"

                placeholderTextColor="#999"

                secureTextEntry

                style={styles.input}

                value={password}

                onChangeText={setPassword}
              />

            </View>

            {/* CONFIRM PASSWORD */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Confirm Password
              </Text>

              <TextInput

                placeholder="********"

                placeholderTextColor="#999"

                secureTextEntry

                style={styles.input}

                value={confirmPassword}

                onChangeText={
                  setConfirmPassword
                }
              />

            </View>

            {/* ERROR */}

            {error ? (

              <Text style={styles.error}>
                {error}
              </Text>

            ) : null}

            {/* SUCCESS */}

            {success ? (

              <Text style={styles.success}>
                {success}
              </Text>

            ) : null}

            {/* SIGNUP BUTTON */}

            <TouchableOpacity

              style={styles.button}

              onPress={handleSignup}

              disabled={isLoading}
            >

              {isLoading ? (

                <ActivityIndicator
                  color="white"
                />

              ) : (

                <Text style={styles.buttonText}>
                  Create Account
                </Text>

              )}

            </TouchableOpacity>

            {/* LOGIN */}

            <TouchableOpacity

              onPress={() =>
                router.push("/(auth)")
              }
            >

              <Text style={styles.footerText}>

                Already have an account?

                <Text style={styles.signupText}>
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

    minHeight: 760,
  },

  title: {

    fontSize: 34,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  subtitle: {

    fontSize: 15,

    color: "#777",

    marginTop: 8,

    marginBottom: 28,

    fontFamily: "PoppinsRegular",
  },

  inputContainer: {
    marginBottom: 18,
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

    marginTop: 12,
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

  signupText: {

    color: "#FF4D8D",

    fontFamily: "PoppinsSemiBold",
  },

  error: {

    color: "#FF4D6D",

    textAlign: "center",

    marginBottom: 14,

    fontFamily: "PoppinsMedium",
  },

  success: {

    color: "#1FA971",

    textAlign: "center",

    marginBottom: 14,

    fontFamily: "PoppinsMedium",
  },

});