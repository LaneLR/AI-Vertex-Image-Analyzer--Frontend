export default function getGradeColor (grade: string) {
    const g = grade?.toUpperCase();
    if (g === "A") return "#ff6000";
    if (g === "B") return "#ff6000";
    if (g === "C") return "#ff6000";
    if (g === "D") return "#bb0000";
    return "#bb0000";
  };