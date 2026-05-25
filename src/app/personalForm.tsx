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
  
    "Irregular Periods",
  
    "Cramps",
  
    "Acne",
  
    "Mood Swings",
  
    "Fatigue",
  
    "Weight Gain",
  
    "PCOS",
  
    "Stress",
  ];
  
  export default function OnboardingScreen() {
  
    /* ---------------- STEP ---------------- */
  
    const [step, setStep] =
      useState(1);
  
    const totalSteps = 4;
  
    /* ---------------- BASIC ---------------- */
  
    const [fullName, setFullName] =
      useState("");
  
    const [age, setAge] =
      useState("");
  
    const [phone, setPhone] =
      useState("");
  
    const [city, setCity] =
      useState("");
  
    /* ---------------- WELLNESS ---------------- */
  
    const [cycleLength,
      setCycleLength] =
      useState("");
  
    const [waterGoal,
      setWaterGoal] =
      useState("");
  
    const [sleepHours,
      setSleepHours] =
      useState("");
  
    const [activityLevel,
      setActivityLevel] =
      useState("");
  
    /* ---------------- SYMPTOMS ---------------- */
  
    const [selectedSymptoms,
      setSelectedSymptoms] =
      useState<string[]>([]);
  
    const [customSymptom,
      setCustomSymptom] =
      useState("");
  
    const [duration,
      setDuration] =
      useState("");
  
    /* ---------------- GOALS ---------------- */
  
    const [wellnessGoal,
      setWellnessGoal] =
      useState("");
  
    const [nutritionPreference,
      setNutritionPreference] =
      useState("");
  
    const [plan, setPlan] =
      useState("");
  
    const [consultationTime,
      setConsultationTime] =
      useState("");
  
    const [notes, setNotes] =
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
  
    /* ---------------- TOGGLE SYMPTOMS ---------------- */
  
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
  
    /* ---------------- NEXT ---------------- */
  
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
  
        const parsedUser =
          userData
            ? JSON.parse(userData)
            : null;
  
        const payload = {
  
          fullName,
  
          age: Number(age),
  
          phone,
  
          city,
  
          cycleLength,
  
          waterGoal,
  
          sleepHours,
  
          activityLevel,
  
          symptoms: [
  
            ...selectedSymptoms,
  
            ...(customSymptom
              ? [customSymptom]
              : []),
  
          ].join(", "),
  
          duration,
  
          wellnessGoal,
  
          nutritionPreference,
  
          plan,
  
          consultationTime,
  
          notes,
        };
  
        console.log(payload);
  
        const response =
          await fetch(
  
            "https://womb-care-backend-76858014616.us-central1.run.app/api/enrollments",
  
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
  
        console.log(data);
  
        if (!response.ok) {
  
          setError(
            data.message ||
            "Submission failed"
          );
  
          return;
        }
  
        const updatedUser = {
  
          ...parsedUser,
  
          onboardingCompleted:
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
  
        }, 2000);
  
      } catch (err: any) {
  
        console.log(err);
  
        setError(
          err.message
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
                    Personal Details
                  </Text>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Full Name
                    </Text>
  
                    <TextInput
                      placeholder="Nitin Kumar"
                      placeholderTextColor="#999"
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                    />
  
                  </View>
  
                  <View style={styles.row}>
  
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
  
                      <Text style={styles.label}>
                        Age
                      </Text>
  
                      <TextInput
                        placeholder="21"
                        keyboardType="numeric"
                        style={styles.input}
                        value={age}
                        onChangeText={setAge}
                      />
  
                    </View>
  
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
  
                      <Text style={styles.label}>
                        Phone
                      </Text>
  
                      <TextInput
                        placeholder="+91 XXXXX XXXXX"
                        keyboardType="phone-pad"
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                      />
  
                    </View>
  
                  </View>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      City
                    </Text>
  
                    <TextInput
                      placeholder="Lucknow"
                      style={styles.input}
                      value={city}
                      onChangeText={setCity}
                    />
  
                  </View>
  
                </>
              )}
  
              {/* STEP 2 */}
  
              {step === 2 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Wellness Profile
                  </Text>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Cycle Length
                    </Text>
  
                    <TextInput
                      placeholder="28 days"
                      style={styles.input}
                      value={cycleLength}
                      onChangeText={setCycleLength}
                    />
  
                  </View>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Daily Hydration Goal
                    </Text>
  
                    <TextInput
                      placeholder="3 litres"
                      style={styles.input}
                      value={waterGoal}
                      onChangeText={setWaterGoal}
                    />
  
                  </View>
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Sleep Hours
                    </Text>
  
                    <TextInput
                      placeholder="8 hours"
                      style={styles.input}
                      value={sleepHours}
                      onChangeText={setSleepHours}
                    />
  
                  </View>
  
                  <Text style={styles.label}>
                    Activity Level
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "Low",
                      "Moderate",
                      "Active",
                    ].map((item) => {
  
                      const active =
                        activityLevel === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setActivityLevel(item)
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
  
              {/* STEP 3 */}
  
              {step === 3 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Symptoms & Wellness
                  </Text>
  
                  <Text style={styles.label}>
                    Symptoms
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
                      Duration
                    </Text>
  
                    <TextInput
                      placeholder="2 years"
                      style={styles.input}
                      value={duration}
                      onChangeText={setDuration}
                    />
  
                  </View>
  
                </>
              )}
  
              {/* STEP 4 */}
  
              {step === 4 && (
  
                <>
  
                  <Text style={styles.sectionTitle}>
                    Goals & Preferences
                  </Text>
  
                  <Text style={styles.label}>
                    Wellness Goal
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "Stress Relief",
                      "Hormonal Balance",
                      "Better Sleep",
                      "Weight Management",
                    ].map((item) => {
  
                      const active =
                        wellnessGoal === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setWellnessGoal(item)
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
  
                  <Text style={styles.label}>
                    Nutrition Preference
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "Vegetarian",
                      "Balanced",
                      "High Protein",
                      "Vegan",
                    ].map((item) => {
  
                      const active =
                        nutritionPreference === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setNutritionPreference(item)
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
  
                  <Text style={styles.label}>
                    Preferred Plan
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "basic",
                      "premium",
                      "consultation",
                    ].map((item) => {
  
                      const active =
                        plan === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setPlan(item)
                          }
                        >
  
                          <Text
                            style={[
  
                              styles.optionText,
  
                              active &&
                                styles.activeOptionText,
                            ]}
                          >
  
                            {item.charAt(0).toUpperCase() +
                              item.slice(1)}
  
                          </Text>
  
                        </TouchableOpacity>
                      );
                    })}
  
                  </View>
  
                  <Text style={styles.label}>
                    Consultation Time
                  </Text>
  
                  <View style={styles.optionsRow}>
  
                    {[
                      "Morning",
                      "Afternoon",
                      "Evening",
                      "Night",
                    ].map((item) => {
  
                      const active =
                        consultationTime === item;
  
                      return (
  
                        <TouchableOpacity
  
                          key={item}
  
                          style={[
  
                            styles.optionButton,
  
                            active &&
                              styles.activeOptionButton,
                          ]}
  
                          onPress={() =>
                            setConsultationTime(item)
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
  
                  <View style={styles.inputContainer}>
  
                    <Text style={styles.label}>
                      Additional Notes
                    </Text>
  
                    <TextInput
                      multiline
                      placeholder="Write your wellness notes..."
                      textAlignVertical="top"
                      style={styles.textArea}
                      value={notes}
                      onChangeText={setNotes}
                    />
  
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
                        Complete
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
      marginBottom: 10,
    },
  
    optionsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
    },
  
    optionButton: {
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 18,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#EEE",
    },
  
    activeOptionButton: {
      backgroundColor: "#111",
      borderColor: "#111",
    },
  
    optionText: {
      color: "#555",
      fontSize: 13,
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
      justifyContent: "space-between",
      marginTop: 30,
      gap: 14,
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