const response = await fetch("https://api64.ipify.org");
const parsed = await response.text();

export default parsed;
