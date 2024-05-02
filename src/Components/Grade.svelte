<script>
    import '/src/css/tailwind.css';
    // Internally use Yosemite grading, then convert
    export let grade = "5.10a";
    grade = grade.toLowerCase();

    export let isBoulder = false;

    export let system = "yosemite";
    system = system.toLowerCase();

    let calculatedGrade = "Undefined";

    let yosemiteGrades = ["5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a", "5.12b", "5.12c", "5.12d", "5.13a", "5.13b", "5.13c", "5.13d", "5.14a", "5.14b", "5.14c", "5.14d", "5.15a", "5.15b", "5.15c", "5.15d"];
    let frenchGrades = ["4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c"];

    let vGrades = ["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12", "v13", "v14", "v15", "v16"];
    let frenchBoulderGrades = ["4", "4+", "5", "5+", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+"];

    if (isBoulder) {
        if (system == "yosemite") {
            calculatedGrade = grade;
        } else if (system == "french") {
            for (let i = 0; i < vGrades.length; i++) {
                if (vGrades[i] == grade) {
                    calculatedGrade = frenchBoulderGrades[i];
                }
            }
        } else {
            calculatedGrade = "Error";
        }
    } else {
        if (system == "yosemite") {
            calculatedGrade = grade;
        } else if (system == "french") {
            for (let i = 0; i < yosemiteGrades.length; i++) {
                if (yosemiteGrades[i] == grade) {
                    calculatedGrade = frenchGrades[i];
                }
            }
        } else {
            // Might throw exception
            calculatedGrade = "Error";
        }
    }


</script>

<h4 class="prose prose-sm">{calculatedGrade}</h4>