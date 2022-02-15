import { Pool } from "../deps.js";


const client = new Pool({
  hostname: "abul.db.elephantsql.com",
  database: "lelmphiv",
  user: "lelmphiv",
  password: "HC2rLb4pLhUVhu3GszaBb0GfPPIkIhKz",
  port: 5432,
});


const executeQuery = async (query, ...args) => {
  const response = {};
  let client;
  console.log("executeQuery: " + query + ", args:" + args[0])

  try {
    client = await client.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      console.log(result.rows);
      response.rows = result.rows;
    }
  } catch (e) {
    console.log(e);
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  
  return response;
};

export { executeQuery, client };