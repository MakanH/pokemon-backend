import pino from "pino";
const streams = [
  {
    level: "trace", // support logging of all levels to this location
    stream: process.stdout, // logs to the standard output
  },
  {
    level: "trace", // support logging of all levels to this location
    stream: pino.destination("logs/server-log"), // log to this file
  },
];
const minimum_log_level = "debug";

const logger =
  process.env.LOG_TO_CONSOLE_ONLY == "true"
    ? pino({
        level: process.env.PINO_LOG_LEVEL || minimum_log_level, // minimum level to log
      })
    : pino(
        {
          level: process.env.PINO_LOG_LEVEL || minimum_log_level, // minimum level to log
        },
        pino.multistream(streams),
      );
export default logger;
