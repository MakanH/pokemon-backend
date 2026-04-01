import pino from "pino";
const streams = [
  {
    stream: process.stdout, // logs to the standard output
  },
  {
    stream: pino.destination("logs/server-log"), // log to this file
  },
];
const logger = pino(
  {
    level: "debug", // minimum level to log
  },
  pino.multistream(streams),
);

export default logger;
