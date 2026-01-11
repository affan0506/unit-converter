const unitData = {
    length: { Meters: 1, Kilometers: 1000, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254 },
    mass: { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495 },
    temp: ['Celsius', 'Fahrenheit', 'Kelvin']
};

const category = document.getElementById('unitCategory');
const fromSelect = document.getElementById('fromUnit');
const toSelect = document.getElementById('toUnit');
const inputField = document.getElementById('inputValue');
const outputField = document.getElementById('outputValue');

function populateUnits() {
    const type = category.value;
    const options = type === 'temp' ? unitData.temp : Object.keys(unitData[type]);
    
    const html = options.map(u => `<option value="${u}">${u}</option>`).join('');
    fromSelect.innerHTML = html;
    toSelect.innerHTML = html;
    // Set default "To" unit to something different
    if(toSelect.options.length > 1) toSelect.selectedIndex = 1;
    performConversion();
}

function performConversion() {
    const val = parseFloat(inputField.value);
    if (isNaN(val)) {
        outputField.value = "";
        return;
    }

    // Input Validation: No negative mass or length
    if ((category.value === 'mass' || category.value === 'length') && val < 0) {
        outputField.value = "Error: Value < 0";
        return;
    }

    let result;
    if (category.value === 'temp') {
        result = convertTemperature(val, fromSelect.value, toSelect.value);
    } else {
        const ratio = unitData[category.value][fromSelect.value] / unitData[category.value][toSelect.value];
        result = val * ratio;
    }

    outputField.value = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function convertTemperature(v, from, to) {
    let c;
    if (from === 'Celsius') c = v;
    else if (from === 'Fahrenheit') c = (v - 32) * 5/9;
    else c = v - 273.15;

    if (to === 'Celsius') return c;
    if (to === 'Fahrenheit') return (c * 9/5) + 32;
    return c + 273.15;
}

// History Management
document.getElementById('saveBtn').addEventListener('click', () => {
    if (!outputField.value || outputField.value.includes("Error")) return;
    
    const entry = `${inputField.value} ${fromSelect.value} ➜ ${outputField.value} ${toSelect.value}`;
    const li = document.createElement('li');
    li.innerHTML = `<span>${entry}</span><small>${new Date().toLocaleTimeString()}</small>`;
    document.getElementById('historyList').prepend(li);
});

document.getElementById('clearHistory').addEventListener('click', () => {
    document.getElementById('historyList').innerHTML = "";
});

// Event Listeners
[category, fromSelect, toSelect, inputField].forEach(el => {
    el.addEventListener('change', performConversion);
    el.addEventListener('input', performConversion);
});
category.addEventListener('change', populateUnits);
window.addEventListener('DOMContentLoaded', populateUnits);