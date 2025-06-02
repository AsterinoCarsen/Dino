import React from 'react';

interface BoulderSelectorProps {
    setGrade: (grade: string) => void;
}

/**
 * All the options inside 'create new ascent' inside Logbook for selecting the grade.
 * @param setGrade a function that takes a string and returns void
 * @returns 
 */
export default function BoulderGradeOptions({ setGrade }: BoulderSelectorProps) {
    return (
        <select
            className='border p-2 rounded w-full'
            defaultValue='5.5'
            onChange={(e) => setGrade(e.target.value)}
            required
        >
            <option value="5.5" disabled>Select Boulder Grades</option>

            <option value="v0">v0</option>
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
            <option value="v4">v4</option>
            <option value="v5">v5</option>
            <option value="v6">v6</option>
            <option value="v7">v7</option>
            <option value="v8">v8</option>
            <option value="v9">v9</option>
            <option value="v10">v10</option>
            <option value="v11">v11</option>
            <option value="v12">v12</option>
            <option value="v13">v13</option>
            <option value="v14">v14</option>
            <option value="v15">v15</option>
            <option value="v16">v16</option>
            <option value="v17">v17</option>

        </select>
    )
}