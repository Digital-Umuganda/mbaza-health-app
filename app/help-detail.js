import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { helpData } from "../assets/data/help";
import { useLocalSearchParams } from "expo-router";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    color: "#478CCA",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  step: {
    fontSize: 16,
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    marginTop: 20,
    fontStyle: "italic",
  },
});

const HelpDetail = () => {
  const params = useLocalSearchParams();
  const { title, description, notes } = helpData[params.id];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
      <Text style={styles.note}>{notes}</Text>
    </ScrollView>
  );
};

export default HelpDetail;
