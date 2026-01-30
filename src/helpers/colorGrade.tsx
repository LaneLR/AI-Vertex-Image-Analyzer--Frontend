export default function getGradeColor (grade: string) {
    const g = grade?.toUpperCase();
    if (g === "A") return "#ff6000";
    if (g === "B") return "#ff8740";
    if (g === "C") return "#d46a2f";
    if (g === "D") return "#8b0000";
    return "#4a4a4a";
  };