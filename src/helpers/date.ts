export function billerDateFormatter() {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const millisecond = date.getMilliseconds().toString().padStart(3, '0');
  
    const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}+0700`;
    const requestDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    return { formattedDate, date, requestDate }
  }