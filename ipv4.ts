const response = await fetch("https://api.ipify.org");
const parsed = await response.text();

export default parsed;
