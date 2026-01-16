export default function getGradeColor (grade: string) {
    const g = grade?.toUpperCase();
    if (g === "A") return "#a855f7";
    if (g === "B") return "#2431e9";
    if (g === "C") return "#eab308";
    if (g === "D") return "#f97316";
    return "#ef4444";
  };