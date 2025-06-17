import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
  underlineText?: boolean;
  borderColor?: string;
  fontSize?: number;
  loading?: boolean;
  children?: React.ReactNode;
};

export default function Button({
  title,
  backgroundColor,
  textColor,
  onPress,
  underlineText,
  borderColor,
  fontSize,
  loading,
  children,
}: Props) {
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      style={{
        backgroundColor,
        width: "100%",
        height: 60,
        borderRadius: 8,
        justifyContent: "center",
        borderColor,
        borderWidth: borderColor ? 1 : 0,
        flexDirection: "row",
        paddingHorizontal: 10,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            color: textColor,
            textAlign: "center",
            fontSize: fontSize || 22,
            fontWeight: "bold",
            textDecorationLine: underlineText ? "underline" : "none",
          }}
        >
          {title}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator
          color={"#FFFFFF"}
          animating={loading != null && loading}
        />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
