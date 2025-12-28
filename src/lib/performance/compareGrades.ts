import ropeGrades from "./ropeGrades.json";
import boulderGrades from "./boulderGrades.json";

export function getHigherGrade(grade1: string, grade2: string): string {
    if (grade1 === "VB") return grade2;
    if (grade2 === "VB") return grade1;

    const g1 = getGradeValue(grade1);
    const g2 = getGradeValue(grade2);

    return g1 >= g2 ? grade1 : grade2;
}

function getGradeValue(grade: string): number {
    grade = grade.toLowerCase();
    if (grade.startsWith("v")) {
        return boulderGrades[grade as keyof typeof boulderGrades] ?? -1;        
    }

    if (grade.startsWith("5")) {
        return ropeGrades[grade as keyof typeof ropeGrades] ?? -1;
    }

    return -1;
}