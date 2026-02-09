/**
 * Temperature conversion utilities for MetalCore
 * All temperatures in the database are stored in Celsius
 */

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9 / 5) + 32);
};

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
    return Math.round((fahrenheit - 32) * 5 / 9);
};

/**
 * Format temperature with unit symbol
 * @param {number} temp - Temperature value (always in Celsius from database)
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @param {boolean} includeUnit - Whether to include the unit symbol
 * @returns {string} Formatted temperature string
 */
export const formatTemperature = (temp, unitSystem = 'metric', includeUnit = true) => {
    const value = unitSystem === 'imperial' ? celsiusToFahrenheit(temp) : temp;
    const unit = includeUnit ? (unitSystem === 'imperial' ? '°F' : '°C') : '';
    return `${value}${unit}`;
};

/**
 * Get the temperature unit symbol
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {string} Unit symbol
 */
export const getTemperatureUnit = (unitSystem = 'metric') => {
    return unitSystem === 'imperial' ? '°F' : '°C';
};

/**
 * Convert temperature based on unit system
 * @param {number} tempCelsius - Temperature in Celsius (from database)
 * @param {string} unitSystem - 'metric' or 'imperial'
 * @returns {number} Converted temperature
 */
export const convertTemperature = (tempCelsius, unitSystem = 'metric') => {
    return unitSystem === 'imperial' ? celsiusToFahrenheit(tempCelsius) : tempCelsius;
};
