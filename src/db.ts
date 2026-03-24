import Firebird from "node-firebird";


const options = {
  host: "34.133.194.40",
  port: 3051,
  database: "C:\\sistemas\\c146\\CDB\\min.25.cdb",
  user: "GUEST",
  password: "qwe@123#456+789",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

export function connectDB(): Promise<any> {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, function (err:any, db:any) {
      if (err) reject(err);
      resolve(db);
    });
  });
}