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

export default function SignupScreen() {
    const navigation = useNavigation<any>();

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

          <View style={styles.topSection}>
            <Text style={styles.logo}>
              WombCare
            </Text>
          </View>

          <View style={styles.card}>

            <Text style={styles.title}>
              Sign up
            </Text>

            <Text style={styles.subtitle}>
              Create your healthcare account
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Full Name
              </Text>

              <TextInput
                placeholder="Nitin Kumar"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Password
              </Text>

              <TextInput
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
              />
            </View>
            
              <TouchableOpacity
  onPress={() => router.push("/")}
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

    minHeight: 650,
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

});