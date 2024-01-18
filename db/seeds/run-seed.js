const { Pool } = require('pg');
const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');

const runSeed = async () => {
  const pool = new Pool(); 
  await seed(devData, pool); 
  await pool.end(); 
};

module.exports = {
  runSeed
};
