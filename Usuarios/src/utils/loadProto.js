const { loadPackageDefinition } = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

function loadProto(serviceName) {
  const PROTO_PATH = path.join("src", "protos", `${serviceName}.proto`);
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  return loadPackageDefinition(packageDefinition)[serviceName];
}

module.exports = { loadProto };