import { View, Text } from "react-native";

type Props = {
  title: string;
  value: string;
};

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <View className="bg-zinc-900 rounded-3xl p-6 mb-4">
      <Text className="text-zinc-400 text-lg">
        {title}
      </Text>

      <Text className="text-white text-3xl font-bold mt-2">
        {value}
      </Text>
    </View>
  );
}

