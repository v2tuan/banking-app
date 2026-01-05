const units = [
    '', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'
];

function readThreeDigits(num) {
    const ones = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    let hundred = Math.floor(num / 100);
    let ten = Math.floor((num % 100) / 10);
    let unit = num % 10;
    let result = '';

    if (hundred > 0) {
        result += ones[hundred] + ' trăm ';
        if (ten === 0 && unit > 0) result += 'lẻ ';
    }

    if (ten > 1) {
        result += ones[ten] + ' mươi ';
        if (unit === 1) result += 'mốt ';
        else if (unit === 5) result += 'lăm ';
        else if (unit > 0) result += ones[unit] + ' ';
    } else if (ten === 1) {
        result += 'mười ';
        if (unit === 5) result += 'lăm ';
        else if (unit > 0) result += ones[unit] + ' ';
    } else if (ten === 0 && unit > 0) {
        result += ones[unit] + ' ';
    }

    return result.trim();
}

export function numberToVndText(number) {
    if (!number || number <= 0) return '';

    let num = Math.floor(number);
    let unitIndex = 0;
    let result = '';

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk > 0) {
            result = readThreeDigits(chunk) + ' ' + units[unitIndex] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        unitIndex++;
    }

    return result.trim() + ' đồng';
}
