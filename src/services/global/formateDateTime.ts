export const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= '12' ? 'PM' : 'AM';
  const hours12 = String(parseInt(hours) % 12 || 12).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours12}:${minutes}:${seconds} ${ampm}`;
 
};