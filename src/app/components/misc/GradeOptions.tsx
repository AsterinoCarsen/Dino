import React from 'react';

interface GradeSelectorProps {
    setGrade: (grade: string) => void;
}

/**
 * All the options inside 'create new ascent' inside Logbook for selecting the grade.
 * @param setGrade a function that takes a string and returns void
 * @returns 
 */
export default function GradeOptions({ setGrade }: GradeSelectorProps) {
    return (
        <select
            className='border p-2 rounded'
            defaultValue='5.5'
            onChange={(e) => setGrade(e.target.value)}
            required
        >
            <option value="5.5" disabled>Select a grade.</option>
            <option value="5.6">5.6</option>
            <option value="5.7">5.7</option>
            <option value="5.8">5.8</option>
            <option value="5.9">5.9</option>

            <option value="5.10a">5.10a</option>
            <option value="5.10b">5.10b</option>
            <option value="5.10c">5.10c</option>
            <option value="5.10d">5.10d</option>

            <option value="5.11a">5.11a</option>
            <option value="5.11b">5.11b</option>
            <option value="5.11c">5.11c</option>
            <option value="5.12d">5.11d</option>

            <option value="5.12a">5.12a</option>
            <option value="5.12b">5.12b</option>
            <option value="5.12c">5.12c</option>
            <option value="5.12d">5.12d</option>

            <option value="5.13a">5.13a</option>
            <option value="5.13b">5.13b</option>
            <option value="5.13c">5.13c</option>
            <option value="5.13d">5.13d</option>

            <option value="5.14a">5.14a</option>
            <option value="5.14b">5.14b</option>
            <option value="5.14c">5.14c</option>
            <option value="5.14d">5.14d</option>

            <option value="5.15a">5.15a</option>
            <option value="5.15b">5.15b</option>
            <option value="5.15c">5.15c</option>
            <option value="5.15d">5.15d</option>
        </select>
    )
}