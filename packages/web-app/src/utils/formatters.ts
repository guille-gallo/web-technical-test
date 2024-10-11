export const formatOperationalArea = (area: string): string => {
    if (area.startsWith("Operational Area")) {
      const areaNumber = area.split(" ").pop();
      return areaNumber || "Unknown";
    }
    return "Outside areas";
  };