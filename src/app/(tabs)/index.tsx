import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import PrimaryButton from "@/components/ui/PrimaryButtons";

export default function OnboardingScreen() {
  return (
    <LinearGradient
      colors={["#050505", "#111827"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6 justify-between py-10">

        <View className="mt-20">
          <Text className="text-pink-500 text-lg font-semibold">
            WOMBCARE
          </Text>

          <Text className="text-white text-5xl font-bold mt-6 leading-tight">
            Your AI Powered {"\n"}
            Women’s Health Companion
          </Text>

          <Text className="text-zinc-400 text-lg mt-6 leading-8">
            Track cycles, monitor symptoms,
            consult doctors and improve
            hormonal health with AI.
          </Text>
        </View>

        <View>
          <PrimaryButton title="Get Started" />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}