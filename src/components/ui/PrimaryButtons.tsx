import {
    TouchableOpacity,
    Text,
  } from "react-native";
  
  type Props = {
    title: string;
    onPress?: () => void;
  };
  
  export default function PrimaryButton({
    title,
    onPress,
  }: Props) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-pink-500 rounded-2xl py-4 items-center"
      >
        <Text className="text-white text-lg font-semibold">
          {title}
        </Text>
      </TouchableOpacity>
    );
  }