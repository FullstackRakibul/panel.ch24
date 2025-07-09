// composables/useNumberToWords.js
export const useNumberToWords = (num) => {
// Implementation of number to words conversion
// This is a simplified version - you might want a more complete solution
const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

if (num === 0) return 'Zero'

function convertHundreds(n) {
if (n > 99) {
return units[Math.floor(n / 100)] + ' Hundred ' + convertTens(n % 100)
} else {
return convertTens(n)
}
}

function convertTens(n) {
    if (n < 10) return units[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
}
return convertHundreds(Math.floor(num)) + ' Taka Only';
}