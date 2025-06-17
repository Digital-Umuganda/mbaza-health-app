import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

interface ComboboxProps {
  options: { title: string }[];
  defaultValue?: { title: string };
  onSelect?: (item: { title: string }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Combobox({
  options = [],
  defaultValue,
  onSelect = () => {},
  placeholder = "Select an option",
  disabled = false,
}: ComboboxProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#478CCA3D",
        paddingVertical: 7,
        paddingHorizontal: 15,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/location.png")}
        style={{ height: 20, width: 16 }}
      />
      <SelectDropdown
        disabled={disabled}
        data={options}
        onSelect={onSelect}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text
                style={{
                  color: selectedItem ? "#3D576F" : "#3D576F8E",
                  flex: 1,
                }}
              >
                {(selectedItem && selectedItem.title) || placeholder}
              </Text>
              <Ionicons
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        defaultValue={defaultValue}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Ionicons name={item.icon} style={styles.dropdownItemIconStyle} />
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    // width: '100%',
    flex: 1,
    // height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dropdownButtonArrowStyle: {
    fontSize: 24,
    color: "#3D576F",
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
