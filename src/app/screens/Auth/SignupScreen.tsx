import React, { useState } from "react";

import { useFonts } from "expo-font";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
  Image,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function SignupScreen() {

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

  const [hidePassword,
    setHidePassword] =
    useState(true);

  const [hideConfirmPassword,
    setHideConfirmPassword] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

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
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {

        setError(
          "Please fill all fields"
        );

        return;
      }

      if (
        password !== confirmPassword
      ) {

        setError(
          "Passwords do not match"
        );

        return;
      }

      if (password.length < 6) {

        setError(
          "Password should be at least 6 characters"
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

      /* SAVE TOKEN */

      if (data.token) {

        await AsyncStorage.setItem(
          "userToken",
          data.token
        );
      }

      /* SAVE USER */

      if (data.doctor) {

        await AsyncStorage.setItem(

          "userData",

          JSON.stringify(
            data.doctor
          )
        );
      }

      /* SAVE ROLE */

      await AsyncStorage.setItem(
        "userRole",
        data.role || "user"
      );

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

          {/* CARD */}

          <View style={styles.card}>

            {/* TABS */}

            <View style={styles.tabsContainer}>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(auth)")
                }
              >
                <Text style={styles.inactiveTabText}>
                  Log in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.activeTab}
              >
                <Text style={styles.activeTabText}>
                  Sign up
                </Text>
              </TouchableOpacity>

            </View>

            {/* LOGO */}

            <View style={styles.topSection}>

              <Image
                source={require("../../../assets/images/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text style={styles.logo}>
                WombCare
              </Text>

            </View>

            {/* NAME */}

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
                Your Email
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

              <View style={styles.passwordContainer}>

                <TextInput

                  placeholder="••••••••"

                  placeholderTextColor="#999"

                  secureTextEntry={
                    hidePassword
                  }

                  style={styles.passwordInput}

                  value={password}

                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={() =>
                    setHidePassword(
                      !hidePassword
                    )
                  }
                >

                  <Ionicons
                    name={
                      hidePassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={22}
                    color="#999"
                  />

                </TouchableOpacity>

              </View>

            </View>

            {/* CONFIRM PASSWORD */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Confirm Password
              </Text>

              <View style={styles.passwordContainer}>

                <TextInput

                  placeholder="••••••••"

                  placeholderTextColor="#999"

                  secureTextEntry={
                    hideConfirmPassword
                  }

                  style={styles.passwordInput}

                  value={confirmPassword}

                  onChangeText={
                    setConfirmPassword
                  }
                />

                <TouchableOpacity
                  onPress={() =>
                    setHideConfirmPassword(
                      !hideConfirmPassword
                    )
                  }
                >

                  <Ionicons
                    name={
                      hideConfirmPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={22}
                    color="#999"
                  />

                </TouchableOpacity>

              </View>

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

            {/* BUTTON */}

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
                  Continue
                </Text>

              )}

            </TouchableOpacity>

            {/* FOOTER */}

            <TouchableOpacity

              onPress={() =>
                router.push("/(auth)")
              }
            >

              <Text style={styles.footerText}>

                Already have an account?

                <Text style={styles.signupText}>
                  {" "}Log in
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
    backgroundColor: "#F5F5F5",
  },

  topSection: {
    alignItems: "center",
    paddingBottom: 24,
  },

  logoImage: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },

  logo: {
    fontSize: 14,
    color: "#6B8DE3",
    fontFamily: "PoppinsRegular",
  },

  tagline: {
    marginTop: 2,
    color: "#A0A0A0",
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 30,
    marginTop: 8,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 45,
    marginBottom: 28,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6B8DE3",
    paddingBottom: 8,
    minWidth: 90,
    alignItems: "center",
  },

  activeTabText: {
    fontSize: 17,
    color: "#6B8DE3",
    fontFamily: "PoppinsBold",
  },

  inactiveTabText: {
    fontSize: 17,
    color: "#D2D2D2",
    fontFamily: "PoppinsBold",
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 10,
    color: "#222",
    fontFamily: "PoppinsSemiBold",
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 15,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
    color: "#333",
  },

  passwordContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },

  button: {
    height: 58,
    backgroundColor: "#6B8DE3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
  },

  footerText: {
    marginTop: 34,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },

  signupText: {
    color: "#6B8DE3",
    fontFamily: "PoppinsSemiBold",
  },

  error: {
    color: "#FF6B6B",
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "PoppinsMedium",
  },

  success: {
    color: "#1FA971",
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "PoppinsMedium",
  },

});