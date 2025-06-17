import { LoadingOverlayModal } from "@/components/LoadingOverlayModal";
import instance from "@/utilities";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Settings = {
  name: string;
  phone: string;
  max_followup_hours: number;
  min_followup_hours: number;
};

interface SettingsContextType {
  settings: Settings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isPending, setIsPending] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    name: "Umuganda Digital",
    phone: "+250788000000",
    max_followup_hours: 336, // 14 days
    min_followup_hours: 96, // 4 days
  });

  useEffect(() => {
    setIsPending(true);
    instance
      .get<Settings>("/api/v1/settings/contacts")
      .then(({ data }) => {
        setSettings({
          name: data.name || "Umuganda Digital",
          phone: data.phone || "+250788000000",
          max_followup_hours: data.max_followup_hours || 336, // Default to 14 days
          min_followup_hours: data.min_followup_hours || 96, // Default to 4 days
        });
      })
      .catch((error) => {
        console.error("Failed to fetch settings:", error);
        // Optionally, you can set default values or handle the error as needed
      })
      .finally(() => {
        setIsPending(false);
      });
  }, []);

  if (isPending) {
    return <LoadingOverlayModal visible />;
  }

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
