// Convert any parsable date string into "YYYY-MM-DD"
function convertToDate(str) {
    let date = new Date(str);  // parse string into Date
  
    if (isNaN(date)) {
      throw new Error("Invalid date string: " + str);
    }
  
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    let day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  // Export function
  module.exports = { convertToDate : convertToDate};
  