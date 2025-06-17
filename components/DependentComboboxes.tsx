import { getCells, getSectors, getVillages } from "@/constants/locations";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Combobox from "./Combobox";

interface DependentComboboxesProps {
  district: string;
  onLocationChange?: (location: {
    district: string;
    sector: string;
    cell: string;
    village: string;
  }) => void;
  errorBag?: {
    sector?: boolean;
    cell?: boolean;
    village?: boolean;
  };
  initialValues?: {
    sector?: string;
    cell?: string;
    village?: string;
  };
}

const DependentComboboxes: React.FC<DependentComboboxesProps> = ({
  district,
  onLocationChange,
  errorBag = {},
  initialValues = {},
}) => {
  const [sector, setSector] = useState<string>("");
  const [cell, setCell] = useState<string>("");
  const [village, setVillage] = useState<string>("");

  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Reset dependent selections when district changes
  useEffect(() => {
    if (district) {
      const availableSectors = getSectors(district);
      setSectors(availableSectors);
      setSector("");
      setCell("");
      setVillage( "");
      setCells([]);
      setVillages([]);
    } else {
      setSectors([]);
      setSector("");
      setCell("");
      setVillage( "");
      setCells([]);
      setVillages([]);
    }
  }, [district]);

  // Reset cells and villages when sector changes
  useEffect(() => {
    if (district && sector) {
      const availableCells = getCells(district, sector);
      setCells(availableCells);
      setCell("");
      setVillage( "");
      setVillages([]);
    } else {
      setCells([]);
      setCell("");
      setVillage( "");
      setVillages([]);
    }
  }, [district, sector]);

  // Reset villages when cell changes
  useEffect(() => {
    if (district && sector && cell) {
      const availableVillages = getVillages(district, sector, cell);
      setVillages(availableVillages);
      setVillage( "");
    } else {
      setVillages([]);
      setVillage( "");
    }
  }, [district, sector, cell]);

  // Notify parent component of location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        district,
        sector,
        cell,
        village,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, sector, cell, village]);

  if (!district) {
    return null;
  }

  return (
    <View style={{ width: "100%", marginBottom: 20 }}>
      {/* Sector Selection */}
      <View style={{ marginBottom: 16 }}>
        <Combobox
          options={sectors.map((s) => ({ title: s }))}
          onSelect={(item) => setSector(item.title)}
          placeholder="Umurenge"
          disabled={sectors.length === 0}
          defaultValue={{ title:  initialValues.sector || "" }}
        />
        {errorBag.sector && (
          <Text style={{ color: "red", marginTop: 4 }}>Hitamo umurenge.</Text>
        )}
      </View>

      {/* Cell Selection */}
      {sector && (
        <View style={{ marginBottom: 16 }}>
          <Combobox
            options={cells.map((c) => ({ title: c }))}
            onSelect={(item) => setCell(item.title)}
            placeholder="Akagari"
            disabled={cells.length === 0}
            defaultValue={{ title: "" }}
          />
          {errorBag.cell && (
            <Text style={{ color: "red", marginTop: 4 }}>Hitamo akagari.</Text>
          )}
        </View>
      )}

      {/* Village Selection */}
      {cell && (
        <View style={{ marginBottom: 16 }}>
          <Combobox
            options={villages.map((v) => ({ title: v }))}
            onSelect={(item) => setVillage(item.title)}
            placeholder="Umudugudu"
            disabled={villages.length === 0}
            defaultValue={{ title:  "" }}
          />
          {errorBag.village && (
            <Text style={{ color: "red", marginTop: 4 }}>
              Hitamo umudugudu.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default DependentComboboxes;
