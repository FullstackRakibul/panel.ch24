export const useNumberToWords = (num) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    if (num === 0) return 'Zero Taka Only';
  
    function convertLessThanOneThousand(n) {
      if (n === 0) return '';
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
      
      // For hundreds
      return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanOneThousand(n % 100) : '');
    }
  
    function convertNumber(n) {
      if (n === 0) return '';
      
      let result = '';
      const crore = Math.floor(n / 10000000);
      n %= 10000000;
      
      const lakh = Math.floor(n / 100000);
      n %= 100000;
      
      const thousand = Math.floor(n / 1000);
      n %= 1000;
      
      if (crore > 0) {
        result += convertLessThanOneThousand(crore) + ' Crore';
      }
      
      if (lakh > 0) {
        if (result !== '') result += ' ';
        result += convertLessThanOneThousand(lakh) + ' Lakh';
      }
      
      if (thousand > 0) {
        if (result !== '') result += ' ';
        result += convertLessThanOneThousand(thousand) + ' Thousand';
      }
      
      if (n > 0) {
        if (result !== '') result += ' ';
        result += convertLessThanOneThousand(n);
      }
      
      return result;
    }
  
    // Handle decimal part (paisa) if needed
    const taka = Math.floor(num);
    const paisa = Math.round((num - taka) * 100);
    
    let result = convertNumber(taka) + ' Taka';
    
    if (paisa > 0) {
      result += ' and ' + convertLessThanOneThousand(paisa) + ' Paisa';
    }
    
    return result + ' Only';
  };