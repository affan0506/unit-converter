const units = {
    length: { Meters: 1, Kilometers: 1000, Miles: 1609.34, Feet: 0.3048 },
    mass: { Kilograms: 1, Grams: 0.001, Pounds: 0.453592 },
    temp: ['Celsius', 'Fahrenheit', 'Kelvin']
};

const cat = document.getElementById('unitCategory');
const fromU = document.getElementById('fromUnit');
const toU = document.getElementById('toUnit');
const input = document.getElementById('inputValue');
const output = document.getElementById('outputValue');

function setup() {
    const type = cat.value;
    const options = type === 'temp' ? units.temp : Object.keys(units[type]);
    const list = options.map(u => `<option value="${u}">${u}</option>`).join('');
    fromU.innerHTML = toU.innerHTML = list;
    convert();
}

function convert() {
    const v = parseFloat(input.value);
    if (isNaN(v)) return output.value = "";

    if (cat.value === 'temp') {
        output.value = calcTemp(v, fromU.value, toU.value).toFixed(2);
    } else {
        const res = v * (units[cat.value][fromU.value] / units[cat.value][toU.value]);
        output.value = res.toFixed(4);
    }
}

function calcTemp(v, f, t) {
    let c = (f === 'Celsius') ? v : (f === 'Fahrenheit') ? (v-32)*5/9 : v-273.15;
    return (t === 'Celsius') ? c : (t === 'Fahrenheit') ? (c*9/5)+32 : c+273.15;
}

document.getElementById('saveBtn').onclick = () => {
    if(!output.value) return;
    const li = document.createElement('li');
    li.textContent = `${input.value}${fromU.value} = ${output.value}${toU.value}`;
    document.getElementById('historyList').prepend(li);
};

cat.onchange = setup;
[input, fromU, toU].forEach(el => el.oninput = convert);
window.onload = setup;