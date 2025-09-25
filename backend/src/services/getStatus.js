import { logger } from "../logger.js";

export default () => {
  const payload = { status: "ok", time: new Date().toISOString() };
  logger.debug("Reporting status", payload);

  return payload;
};
