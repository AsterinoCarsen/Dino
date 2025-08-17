export function getHigherGrade(grade1: string, grade2: string): string {
    console.log("Comparing", grade1, " and ", grade2);

    if (grade1.charAt(0) !== grade2.charAt(0)) return "N/A";

    if (grade1.startsWith("V")) {
        const g1 = parseVGrade(grade1);
        const g2 = parseVGrade(grade2);
        return g1 >= g2 ? grade1 : grade2;
    }

    if (grade1.startsWith("5")) {
        const g1 = parseYDSGrade(grade1);
        const g2 = parseYDSGrade(grade2);
        return g1 >= g2 ? grade1 : grade2;
    }

    return "N/A";
}

function parseVGrade(grade: string): number {
    if (grade.toUpperCase() === "VB") return -1;
    return parseInt(grade.slice(1), 10);
}

function parseYDSGrade(grade: string): number {
    const match = grade.match(/^5\.(\d+)([abcd])?$/);
    if (!match) return -1;

    const base = parseInt(match[1], 10) * 10;
    const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

    const letter = match[2];
    return base + (letter ? letterMap[letter] : 0);
}