import React, {
    useState,
  } from "react";
  
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
  
  import AsyncStorage
  from "@react-native-async-storage/async-storage";
  
  import {
    router,
  } from "expo-router";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  import {
    useFonts,
  } from "expo-font";
  
  const symptomOptions = [
  
    "Acne",
  
    "Bloating",
  
    "Fatigue",
  
    "Mood Swings",
  
    "Cramps",
  
    "Irregular Periods",
  
    "PCOS",
  
    "Stress",
  ];
  
  export default function OnboardingScreen() {
  
    /* ---------------- STEP ---------------- */
  
    const [step, setStep] =
      useState(1);
  
    const totalSteps = 3;
  
    /* ---------------- FORM ---------------- */
  
    const [age, setAge] =
      useState("");
  
    const [weight, setWeight] =
      useState("");
  
    const [height, setHeight] =
      useState("");
  
    const [cycleLength,
      setCycleLength] =
      useState("28");
  
    const [targetWater,
      setTargetWater] =
      useState("8");
  
    const [activePlan,
      setActivePlan] =
      useState("");
  
    const [wellnessGoal,
      setWellnessGoal] =
      useState("");
  
    const [personalNotes,
      setPersonalNotes] =
      useState("");
  
    const [selectedSymptoms,
      setSelectedSymptoms] =
      useState<string[]>([]);
  
    const [customSymptom,
      setCustomSymptom] =
      useState("");
  
    /* ---------------- UI ---------------- */
  
    const [loading, setLoading] =
      useState(false);
  
    const [error, setError] =
      useState("");
  
    const [success, setSuccess] =
      useState(false);
  
    /* ---------------- FONTS ---------------- */
  
    const [fontsLoaded] = useFonts({
  
      PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
  
      PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
  
      PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  
      PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    /* ---------------- TOGGLE ---------------- */
  
    const toggleSymptom =
    (symptom: string) => {
  
      if (
        selectedSymptoms.includes(
          symptom
        )
      ) {
  
        setSelectedSymptoms(
  
          selectedSymptoms.filter(
            (item) =>
              item !== symptom
          )
        );
  
      } else {
  
        setSelectedSymptoms([
          ...selectedSymptoms,
          symptom,
        ]);
      }
    };
  
    /* ---------------- BMI ---------------- */
  
    const calculateBMI = () => {
  
      const h =
        Number(height) / 100;
  
      const w =
        Number(weight);
  
      if (!h || !w) return 0;
  
      return +(
        w / (h * h)
      ).toFixed(1);
    };
  
    /* ---------------- NAVIGATION ---------------- */
  
    const nextStep = () => {
  
      if (step < totalSteps) {
  
        setStep(step + 1);
      }
    };
  
    const prevStep = () => {
  
      if (step > 1) {
  
        setStep(step - 1);
      }
    };
  
    /* ---------------- SUBMIT ---------------- */
  
    const handleSubmit =
async () => {

  try {

    setLoading(true);

    setError("");

    const token =
      await AsyncStorage.getItem(
        "userToken"
      );

    const userData =
      await AsyncStorage.getItem(
        "userData"
      );

    if (!userData) {

      setError(
        "Please login again"
      );

      return;
    }

    const parsedUser =
      JSON.parse(userData);

    /* ---------------- CYCLE DATES ---------------- */

    const today =
      new Date();

    const nextPeriodDate =
      new Date();

    nextPeriodDate.setDate(

      today.getDate() +

      Number(cycleLength)
    );

    /* ---------------- BMI ---------------- */

    const bmi =
      calculateBMI();

    /* ---------------- PAYLOAD ---------------- */

    const payload = {

      id:
        parsedUser.id ||

        parsedUser._id,

      name:
        parsedUser.name,

      email:
        parsedUser.email,

      age:
        Number(age),

      weight:
        Number(weight),

      height:
        Number(height),

      cycleLength:
        Number(cycleLength),

      targetWater:
        Number(targetWater),

      activePlan,

      symptoms: [

        ...selectedSymptoms,

        ...(customSymptom
          ? [customSymptom]
          : []),

      ],

      personalNotes,

      wellnessGoal,

      bmi,

      wellnessScore: 82,

      profileCompleted: true,

      /* ---------------- PERIOD TRACKER ---------------- */

      cycleDay: 1,

      cycleStartDate:
        today.toISOString(),

      nextPeriodDate:
        nextPeriodDate.toISOString(),

      isPeriodTrackerEnabled: true,
    };

    console.log(
      "PROFILE PAYLOAD:",
      payload
    );

    /* ---------------- API ---------------- */

    const response =
      await fetch(

        "https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

    const data =
      await response.json();

    console.log(
      "PROFILE RESPONSE:",
      data
    );

    if (

      !response.ok ||

      !data.success

    ) {

      setError(

        data.message ||

        "Failed to save profile"
      );

      return;
    }

    /* ---------------- SAVE USER ---------------- */

    const updatedUser = {

      ...parsedUser,

      profileCompleted:
        true,
    };

    await AsyncStorage.setItem(

      "userData",

      JSON.stringify(
        updatedUser
      )
    );

    setSuccess(true);

    setTimeout(() => {

      router.replace("/(tabs)");

    }, 1800);

  } catch (err: any) {

    console.log(err);

    setError(

      err.message ||

      "Connection failed"
    );

  } finally {

    setLoading(false);
  }
};
    /* ---------------- SUCCESS ---------------- */
  
    if (success) {
  
      return (
  
        <SafeAreaView style={styles.container}>
  
          <View style={styles.successContainer}>
  
            <View style={styles.successCircle}>
  
              <Ionicons
                name="checkmark"
                size={42}
                color="white"
              />
  
            </View>
  
            <Text style={styles.successTitle}>
              Welcome to WombCare
            </Text>
  
            <Text style={styles.successText}>
              Your personalized dashboard is ready.
            </Text>
  
          </View>
  
        </SafeAreaView>
      );
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
          >
  
            {/* TOP */}
  
            <View style={styles.topSection}>
  
              <Text style={styles.logo}>
                WombCare
              </Text>
  
              <Text style={styles.stepText}>
                Step {step} of {totalSteps}
              </Text>
  
              <Text style={styles.headerTitle}>
                Complete your profile
              </Text>
  
              <Text style={styles.headerSubtitle}>
                Personalized wellness onboarding
              </Text>
  
              {/* PROGRESS */}
  
              <View style={styles.progressBar}>
  
                <View
                  style={[
  
                    styles.progressFill,
  
                    {
                      width:
                        `${(step / totalSteps) * 100}%`,
                    },
                  ]}
                />
  
              </View>
  
            </View>
  
            {/* CARD */}
  
            <View style={styles.card}>
  
              {error ? (
  
                <View style={styles.errorBox}>
  
                  <Text style={styles.errorText}>
                    {error}
                  </Text>
  
                </View>
  
              ) : null}
  
              {/* STEP 1 */}
  
              {step === 1 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Health Profile
                  </Text>
  
                  <View style={styles.row}>
  
                    <View style={{ flex: 1 }}>
  
                      <Text style={styles.label}>
                        Age
                      </Text>
  
                      <TextInput
  
                        placeholder="24"
  
                        keyboardType="numeric"
  
                        style={styles.input}
  
                        value={age}
  
                        onChangeText={setAge}
                      />
  
                    </View>
  
                    <View style={{ flex: 1 }}>
  
                      <Text style={styles.label}>
                        Cycle Length
                      </Text>
  
                      <TextInput
  
                        placeholder="28"
  
                        keyboardType="numeric"
  
                        style={styles.input}
  
                        value={cycleLength}
  
                        onChangeText={
                          setCycleLength
                        }
                      />
  
                    </View>
  
                  </View>
  
                  <View style={styles.row}>
  
                    <View style={{ flex: 1 }}>
  
                      <Text style={styles.label}>
                        Height (cm)
                      </Text>
  
                      <TextInput
  
                        placeholder="165"
  
                        keyboardType="numeric"
  
                        style={styles.input}
  
                        value={height}
  
                        onChangeText={setHeight}
                      />
  
                    </View>
  
                    <View style={{ flex: 1 }}>
  
                      <Text style={styles.label}>
                        Weight (kg)
                      </Text>
  
                      <TextInput
  
                        placeholder="62"
  
                        keyboardType="numeric"
  
                        style={styles.input}
  
                        value={weight}
  
                        onChangeText={setWeight}
                      />
  
                    </View>
  
                  </View>
  
                </>
              )}
  
              {/* STEP 2 */}
  
              {step === 2 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Wellness Details
                  </Text>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Daily Water Target
                    </Text>
  
                    <TextInput
  
                      placeholder="8"
  
                      keyboardType="numeric"
  
                      style={styles.input}
  
                      value={targetWater}
  
                      onChangeText={
                        setTargetWater
                      }
                    />
  
                  </View>
  
                  <Text style={styles.label}>
                    Common Symptoms
                  </Text>
  
                  <View style={styles.symptomContainer}>
  
                    {symptomOptions.map(
                      (item) => {
  
                        const active =
                          selectedSymptoms.includes(
                            item
                          );
  
                        return (
  
                          <TouchableOpacity
  
                            key={item}
  
                            style={[
  
                              styles.symptomChip,
  
                              active &&
                                styles.activeSymptomChip,
                            ]}
  
                            onPress={() =>
                              toggleSymptom(item)
                            }
                          >
  
                            <Text
                              style={[
  
                                styles.symptomText,
  
                                active &&
                                  styles.activeSymptomText,
                              ]}
                            >
  
                              {item}
  
                            </Text>
  
                          </TouchableOpacity>
                        );
                      }
                    )}
  
                  </View>
  
                  <TextInput
  
                    placeholder="Custom symptom"
  
                    style={styles.input}
  
                    value={customSymptom}
  
                    onChangeText={
                      setCustomSymptom
                    }
                  />
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Wellness Goal
                    </Text>
  
                    <TextInput
  
                      placeholder="Regularize periods"
  
                      multiline
  
                      textAlignVertical="top"
  
                      style={styles.textArea}
  
                      value={wellnessGoal}
  
                      onChangeText={
                        setWellnessGoal
                      }
                    />
  
                  </View>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Additional Notes
                    </Text>
  
                    <TextInput
  
                      placeholder="Anything you'd like to share..."
  
                      multiline
  
                      textAlignVertical="top"
  
                      style={styles.textArea}
  
                      value={personalNotes}
  
                      onChangeText={
                        setPersonalNotes
                      }
                    />
  
                  </View>
  
                </>
              )}
  
              {/* STEP 3 */}
  
              {step === 3 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Active Plan
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "Starter Plan",
  
                      "Premium 90-Day Hormonal Wellness",
  
                      "Doctor Consultation",
                    ].map((item) => {
  
                      const active =
                        activePlan === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setActivePlan(item)
                          }
                        >
  
                          <Text
                            style={[
  
                              styles.optionText,
  
                              active &&
                                styles.activeOptionText,
                            ]}
                          >
  
                            {item}
  
                          </Text>
  
                        </TouchableOpacity>
                      );
                    })}
  
                  </View>
  
                </>
              )}
  
              {/* BUTTONS */}
  
              <View style={styles.buttonRow}>
  
                {step > 1 && (
  
                  <TouchableOpacity
  
                    style={styles.backButton}
  
                    onPress={prevStep}
                  >
  
                    <Text style={styles.backButtonText}>
                      Back
                    </Text>
  
                  </TouchableOpacity>
                )}
  
                {step < totalSteps ? (
  
                  <TouchableOpacity
  
                    style={styles.nextButton}
  
                    onPress={nextStep}
                  >
  
                    <Text style={styles.nextButtonText}>
                      Continue
                    </Text>
  
                  </TouchableOpacity>
  
                ) : (
  
                  <TouchableOpacity
  
                    style={styles.nextButton}
  
                    onPress={handleSubmit}
                  >
  
                    {loading ? (
  
                      <ActivityIndicator
                        color="white"
                      />
  
                    ) : (
  
                      <Text style={styles.nextButtonText}>
                        Complete Profile
                      </Text>
  
                    )}
  
                  </TouchableOpacity>
                )}
  
              </View>
  
            </View>
  
          </ScrollView>
  
        </KeyboardAvoidingView>
  
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F8F4FF",
    },
  
    topSection: {
      paddingTop: 70,
      paddingHorizontal: 24,
      paddingBottom: 30,
    },
  
    logo: {
      fontSize: 42,
      color: "#FF4D8D",
      fontFamily: "PoppinsBold",
    },
  
    stepText: {
      marginTop: 18,
      fontSize: 13,
      color: "#FF4D8D",
      fontFamily: "PoppinsSemiBold",
    },
  
    headerTitle: {
      marginTop: 12,
      fontSize: 34,
      color: "#111",
      fontFamily: "PoppinsBold",
    },
  
    headerSubtitle: {
      marginTop: 10,
      fontSize: 15,
      color: "#666",
      lineHeight: 26,
      fontFamily: "PoppinsRegular",
    },
  
    progressBar: {
      height: 10,
      backgroundColor: "#F1EAFE",
      borderRadius: 999,
      marginTop: 28,
      overflow: "hidden",
    },
  
    progressFill: {
      height: "100%",
      backgroundColor: "#FF4D8D",
      borderRadius: 999,
    },
  
    card: {
      backgroundColor: "white",
      marginHorizontal: 20,
      borderRadius: 34,
      padding: 24,
      marginBottom: 40,
    },
  
    sectionTitle: {
      fontSize: 28,
      color: "#111",
      marginBottom: 26,
      fontFamily: "PoppinsBold",
    },
  
    inputContainer: {
      marginBottom: 20,
    },
  
    label: {
      fontSize: 14,
      color: "#555",
      marginBottom: 10,
      fontFamily: "PoppinsMedium",
    },
  
    input: {
      height: 58,
      borderRadius: 18,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#EEE",
      paddingHorizontal: 18,
      fontSize: 15,
      fontFamily: "PoppinsRegular",
    },
  
    textArea: {
      minHeight: 120,
      borderRadius: 18,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#EEE",
      paddingHorizontal: 18,
      paddingTop: 18,
      fontSize: 15,
      fontFamily: "PoppinsRegular",
    },
  
    row: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 18,
    },
  
    optionsRow: {
      gap: 14,
    },
  
    optionButton: {
      padding: 18,
      borderRadius: 22,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#EEE",
      marginBottom: 14,
    },
  
    activeOptionButton: {
      backgroundColor: "#111",
      borderColor: "#111",
    },
  
    optionText: {
      color: "#555",
      fontSize: 15,
      fontFamily: "PoppinsMedium",
    },
  
    activeOptionText: {
      color: "white",
    },
  
    symptomContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 16,
    },
  
    symptomChip: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#EEE",
    },
  
    activeSymptomChip: {
      backgroundColor: "#111",
      borderColor: "#111",
    },
  
    symptomText: {
      color: "#555",
      fontSize: 13,
      fontFamily: "PoppinsMedium",
    },
  
    activeSymptomText: {
      color: "white",
    },
  
    buttonRow: {
      flexDirection: "row",
      gap: 14,
      marginTop: 30,
    },
  
    backButton: {
      flex: 1,
      height: 58,
      borderRadius: 24,
      backgroundColor: "#F3F3F3",
      justifyContent: "center",
      alignItems: "center",
    },
  
    nextButton: {
      flex: 1,
      height: 58,
      borderRadius: 24,
      backgroundColor: "#111",
      justifyContent: "center",
      alignItems: "center",
    },
  
    backButtonText: {
      color: "#555",
      fontSize: 16,
      fontFamily: "PoppinsSemiBold",
    },
  
    nextButtonText: {
      color: "white",
      fontSize: 16,
      fontFamily: "PoppinsSemiBold",
    },
  
    errorBox: {
      padding: 14,
      borderRadius: 18,
      backgroundColor: "#FFE8E8",
      marginBottom: 20,
    },
  
    errorText: {
      color: "#D93939",
      textAlign: "center",
      fontFamily: "PoppinsMedium",
    },
  
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
  
    successCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#22C55E",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 30,
    },
  
    successTitle: {
      fontSize: 34,
      color: "#111",
      textAlign: "center",
      fontFamily: "PoppinsBold",
    },
  
    successText: {
      marginTop: 12,
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      lineHeight: 28,
      fontFamily: "PoppinsRegular",
    },
  
  });