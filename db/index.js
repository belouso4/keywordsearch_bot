import { JsonDB, Config } from 'node-json-db';

var db = new JsonDB(new Config("data/myDataBase", true, false, '/'));

export default db