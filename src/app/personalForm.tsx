import React, {
    useState,
  } from "react";
  
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

  import AsyncStorage
  from "@react-native-async-storage/async-storage";
  
  import {
    router,
  } from "expo-router";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  import * as WebBrowser from "expo-web-browser";
  import MedicalDisclaimerModal from "./components/common/MedicalDisclaimerModal";
  import { useResponsive } from "../utils/responsive";
  
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
    const { responsiveContainerStyle } = useResponsive();
  
    /* ---------------- STEP ---------------- */
  
    const [step, setStep] =
      useState(1);
  
    const totalSteps = 3;

    const [isConsentChecked, setIsConsentChecked] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
  
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
    if (!isConsentChecked) {
      setError("Please check the consent box to accept the Privacy Policy & Data Collection terms.");
      return;
    }

    const accepted = await AsyncStorage.getItem("disclaimerAccepted");
    if (accepted !== "true") {
      setShowDisclaimer(true);
      return;
    }

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
  
          <View style={[styles.successContainer, responsiveContainerStyle]}>
  
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
  
            <View style={[styles.topSection, responsiveContainerStyle]}>
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
  
            <View style={[styles.card, responsiveContainerStyle]}>
  
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
  
                  {/* Privacy Consent Checkbox */}
                  <TouchableOpacity
                    style={styles.consentContainer}
                    activeOpacity={0.8}
                    onPress={() => setIsConsentChecked(!isConsentChecked)}
                  >
                    <View style={[styles.consentCheckbox, isConsentChecked && styles.consentCheckboxChecked]}>
                      {isConsentChecked && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <Text style={styles.consentLabel}>
                      I consent to WombCare collecting and processing my cycle data and wellness logs in accordance with the{" "}
                      <Text style={styles.consentLink} onPress={() => WebBrowser.openBrowserAsync("https://wombcare.live/privacy")}>
                        Privacy Policy
                      </Text>.
                    </Text>
                  </TouchableOpacity>
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
  
                    style={[styles.nextButton, !isConsentChecked && styles.nextButtonDisabled]}
  
                    onPress={handleSubmit}
                    disabled={!isConsentChecked || loading}
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
        <MedicalDisclaimerModal visible={showDisclaimer} onAccept={handleSubmit} />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
  
    topSection: {
      paddingTop: 24,
      paddingHorizontal: 28,
      paddingBottom: 18,
    },
  
    logo: {
      fontSize: 24,
      color: "#6B8DE3",
      fontFamily: "PoppinsBold",
    },
  
    stepText: {
      marginTop: 16,
      fontSize: 12,
      color: "#6B8DE3",
      fontFamily: "PoppinsSemiBold",
    },
  
    headerTitle: {
      marginTop: 10,
      fontSize: 28,
      color: "#111",
      fontFamily: "PoppinsBold",
    },
  
    headerSubtitle: {
      marginTop: 6,
      fontSize: 13,
      color: "#888",
      lineHeight: 22,
      fontFamily: "PoppinsRegular",
    },
  
    progressBar: {
      height: 8,
      backgroundColor: "#EAEAEA",
      borderRadius: 999,
      marginTop: 20,
      overflow: "hidden",
    },
  
    progressFill: {
      height: "100%",
      backgroundColor: "#6B8DE3",
      borderRadius: 999,
    },
  
    card: {
      backgroundColor: "white",
      marginHorizontal: 18,
      borderRadius: 34,
      padding: 24,
      marginBottom: 40,
    },
  
    sectionTitle: {
      fontSize: 22,
      color: "#111",
      marginBottom: 22,
      fontFamily: "PoppinsBold",
    },
  
    inputContainer: {
      marginBottom: 16,
    },
  
    label: {
      fontSize: 14,
      color: "#222",
      marginBottom: 10,
      fontFamily: "PoppinsSemiBold",
    },
  
    input: {
      height: 56,
      borderRadius: 18,
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#DCDCDC",
      paddingHorizontal: 18,
      fontSize: 15,
      color: "#333",
      fontFamily: "PoppinsRegular",
    },
  
    textArea: {
      minHeight: 110,
      borderRadius: 18,
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#DCDCDC",
      paddingHorizontal: 18,
      paddingTop: 16,
      fontSize: 15,
      color: "#333",
      fontFamily: "PoppinsRegular",
    },
  
    row: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
  
    optionsRow: {
      gap: 12,
    },
  
    optionButton: {
      padding: 18,
      borderRadius: 20,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#E4E4E4",
      marginBottom: 12,
    },
  
    activeOptionButton: {
      backgroundColor: "#6B8DE3",
      borderColor: "#6B8DE3",
    },
  
    optionText: {
      color: "#555",
      fontSize: 14,
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
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#E4E4E4",
    },
  
    activeSymptomChip: {
      backgroundColor: "#6B8DE3",
      borderColor: "#6B8DE3",
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
      marginTop: 28,
    },
  
    backButton: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: "#F1F1F1",
      justifyContent: "center",
      alignItems: "center",
    },
  
    nextButton: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      backgroundColor: "#6B8DE3",
      justifyContent: "center",
      alignItems: "center",
    },
  
    backButtonText: {
      color: "#555",
      fontSize: 15,
      fontFamily: "PoppinsSemiBold",
    },
  
    nextButtonText: {
      color: "white",
      fontSize: 15,
      fontFamily: "PoppinsSemiBold",
    },
  
    errorBox: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: "#FFECEC",
      marginBottom: 18,
    },
  
    errorText: {
      color: "#E5484D",
      textAlign: "center",
      fontSize: 13,
      fontFamily: "PoppinsMedium",
    },
  
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      backgroundColor: "#F5F5F5",
    },
  
    successCircle: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: "#22C55E",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 26,
    },
  
    successTitle: {
      fontSize: 28,
      color: "#111",
      textAlign: "center",
      fontFamily: "PoppinsBold",
    },
  
    successText: {
      marginTop: 10,
      fontSize: 14,
      color: "#777",
      textAlign: "center",
      lineHeight: 24,
      fontFamily: "PoppinsRegular",
    },
    consentContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: "#F9FAFB",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginTop: 20,
      marginBottom: 10,
    },
    consentCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: "#FF5CA8",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      marginTop: 2,
    },
    consentCheckboxChecked: {
      backgroundColor: "#FF5CA8",
    },
    consentLabel: {
      flex: 1,
      fontSize: 12,
      color: "#4B5563",
      fontFamily: "PoppinsRegular",
      lineHeight: 18,
    },
    consentLink: {
      color: "#FF5CA8",
      fontFamily: "PoppinsSemiBold",
      textDecorationLine: "underline",
    },
    nextButtonDisabled: {
      backgroundColor: "#E5E7EB",
    },
  });