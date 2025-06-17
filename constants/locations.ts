export interface Location {
  district: string;
  sectors: {
    [sectorName: string]: {
      cells: {
        [cellName: string]: string[];
      };
    };
  };
}

export const locationData: Location[] = [
  {
    district: "Musanze",
    sectors: {
      Kimonyi: {
        cells: {
          Gitega: ["Gitega", "Kabeza", "Kagarama"],
          Kimisagara: ["Kimisagara", "Nyamirambo", "Biryogo"],
          Nyakabanda: ["Nyakabanda", "Rwezamenyo", "Gatenga"],
        },
      },
      Shingiro: {
        cells: {
          Remera: ["Remera", "Gisozi", "Kimironko"],
          Kacyiru: ["Kacyiru", "Kamatamu", "Kibagabaga"],
          Kimironko: ["Kimironko", "Bibare", "Gatenga"],
        },
      },
      Nyange: {
        cells: {
          Niboye: ["Niboye", "Kagarama", "Masaka"],
          Gatenga: ["Gatenga", "Kagarama", "Kimisagara"],
          Kanombe: ["Kanombe", "Nyarugunga", "Gahanga"],
        },
      },
      Musanze: {
        cells: {
          Musanze: ["Musanze", "Cyuve", "Nyange"],
          Cyuve: ["Cyuve", "Nyange", "Rwaza"],
          Rwaza: ["Rwaza", "Gataraga", "Nyange"],
        },
      },
    },
  },
  {
    district: "Nyabihu",
    sectors: {
      Bigogwe: {
        cells: {
          Tumba: ["Tumba", "Cyarwa", "Cyahinda"],
          Cyarwa: ["Cyarwa", "Mugombwa", "Rusatira"],
          Cyahinda: ["Cyahinda", "Karama", "Ruhashya"],
        },
      },
      Rambura: {
        cells: {
          Ngoma: ["Ngoma", "Karama", "Ruhashya"],
          Karama: ["Karama", "Cyahinda", "Rusatira"],
          Ruhashya: ["Ruhashya", "Mugombwa", "Tumba"],
        },
      },
    },
  },
];


export const getDistrictData = (districtName: string): Location | undefined => {
  return locationData.find((location) => location.district === districtName);
};

export const getSectors = (districtName: string): string[] => {
  const district = getDistrictData(districtName);
  return district ? Object.keys(district.sectors) : [];
};

export const getCells = (
  districtName: string,
  sectorName: string
): string[] => {
  const district = getDistrictData(districtName);
  if (!district || !district.sectors[sectorName]) return [];
  return Object.keys(district.sectors[sectorName].cells);
};

export const getVillages = (
  districtName: string,
  sectorName: string,
  cellName: string
): string[] => {
  const district = getDistrictData(districtName);
  if (
    !district ||
    !district.sectors[sectorName] ||
    !district.sectors[sectorName].cells[cellName]
  )
    return [];
  return district.sectors[sectorName].cells[cellName];
};
