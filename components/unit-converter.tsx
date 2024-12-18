'use client'

import { useState, ChangeEvent } from "react"
import { Label } from "@radix-ui/react-label"
import { Input } from "./ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "./ui/select"
import { Button } from "./ui/button"

// Define types for better TypeScript support
type UnitCategory = 'length' | 'weight' | 'volume';

export default function UnitConverter() {
    // Define conversion rates for each unit category
    const conversionRates: Record<UnitCategory, Record<string, number>> = {
        length: {
            "Millimeters (mm)": 1,
            "Centimeters (cm)": 10,
            "Meters (m)": 1000,
            "Kilometers (km)": 1000000,
            "Inches (in)": 25.4,
            "Feet (ft)": 304.8,
            "Yards (yd)": 914.4,
            "Miles (mi)": 1609344
        },
        weight: {
            "Grams (g)": 1,
            "Kilograms (kg)": 1000,
            "Ounces (oz)": 28.3495,
            "Pounds (lb)": 453.592
        },
        volume: {
            "Milliliters (ml)": 1,
            "Liters (l)": 1000,
            "Fluid Ounces (fl oz)": 29.5753,
            "Cups (cup)": 240,
            "Pints (pt)": 473.176,
            "Quarts (qt)": 946.353,
            "Gallons (gal)": 3785
        }
    }

    // Define unit types for each category
    const unitTypes: Record<UnitCategory, string[]> = {
        length: [
            "Millimeters (mm)",
            "Centimeters (cm)",
            "Meters (m)",
            "Kilometers (km)",
            "Inches (in)",
            "Feet (ft)",
            "Miles (mi)",
        ],
        weight: [
            "Grams (g)",
            "Kilograms (kg)",
            "Ounces (oz)",
            "Pounds (lb)",
        ],
        volume: [
            "Milliliters (ml)",
            "Liters (l)",
            "Fluid Ounces (fl oz)",
            "Cups (cup)",
            "Pints (pt)",
            "Quarts (qt)",
            "Gallons (gal)"
        ]
    }

    // State to manage input, output units, and values
    const [inputValue, setInputValue] = useState<string>('') // Default to an empty string
    const [inputUnit, setInputUnit] = useState<string>('') // Default to empty string
    const [outputUnit, setOutputUnit] = useState<string>('') // Default to empty string
    const [convertedValue, setConvertedValue] = useState<number | null>(null)

    // Handle the change in input value
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        if (!isNaN(Number(value))) {
            setInputValue(value); // Only set numeric values
        } else {
            setInputValue(''); // Reset to empty string if not a valid number
        }
    }

    // Handle the change in input unit selection
    const handleInputUnitChange = (value: string): void => {
        setInputUnit(value);
    }

    // Handle the change in output unit selection
    const handleOutputUnitChange = (value: string): void => {
        setOutputUnit(value);
    }

    // Perform the conversion based on selected units and input value
    const convertValue = (): void => {
        if (inputValue && inputUnit && outputUnit) {
            let unitCategory: UnitCategory | null = null;

            // Determine unit category (length, weight, volume)
            for (const category in unitTypes) {
                if (unitTypes[category as UnitCategory].includes(inputUnit) &&
                    unitTypes[category as UnitCategory].includes(outputUnit)) {
                    unitCategory = category as UnitCategory;
                    break;
                }
            }

            if (unitCategory) {
                const baseValue = Number(inputValue) * conversionRates[unitCategory][inputUnit];
                const result = baseValue / conversionRates[unitCategory][outputUnit];
                setConvertedValue(result);
            } else {
                setConvertedValue(null);
                alert("Incompatible unit types selected");
            }
        } else {
            setConvertedValue(null);
            alert("Please fill all fields");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-cyan-100 dark:bg-stone-900">
            <div className="p-6 max-w-md w-full bg-card rounded-lg shadow-black/30 hover:shadow-lg shadow-inner">
                <h1 className="text-2xl font-bold mb-1 text-center">Unit Converter</h1>
                <p className="text-sm mb-8 text-center">
                    Convert Values between different units
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="input-unit">From</Label>
                        <Select onValueChange={handleInputUnitChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(unitTypes).map(([category, units]) => (
                                    <SelectGroup key={category}>
                                        <SelectLabel>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectLabel>
                                        {units.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="output-unit">To</Label>
                        <Select onValueChange={handleOutputUnitChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(unitTypes).map(([category, units]) => (
                                    <SelectGroup key={category}>
                                        <SelectLabel>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectLabel>
                                        {units.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="input-value">Value</Label>
                        <Input
                            id="input-value"
                            type="number"
                            placeholder="Enter value"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <Button
                        type="button"
                        className="col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onClick={convertValue}
                    >
                        Convert
                    </Button>
                </div>
                <div className="mt-6 text-center">
                    <div className="text-4xl font-bold">
                        {convertedValue !== null ? convertedValue.toFixed(2) : "0"}
                    </div>
                    <div className="text-muted-foreground">
                        {outputUnit ? outputUnit : "Unit"}
                    </div>
                </div>
            </div>
        </div>
    )
}
