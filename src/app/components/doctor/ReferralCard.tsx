// src/app/doctor/components/ReferralCard.tsx

import { View, Text } from "react-native";

interface Props {
  name: string;
  mobile: string;
  problem: string;
}

export default function ReferralCard({
  name,
  mobile,
  problem,
}: Props) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4">
      <Text className="text-lg font-semibold">
        {name}
      </Text>

      <Text className="text-gray-500 mt-1">
        {mobile}
      </Text>

      <Text className="text-gray-700 mt-3">
        {problem}
      </Text>
    </View>
  );
}