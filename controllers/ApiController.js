const fs = require("fs");
const path = require("path");
const getApi = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../endpoints.json");
    const data = fs.readFileSync(filePath, "utf8");

    const endpoints = JSON.parse(data);

    res.status(200).json(endpoints);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports ={
    getApi
}