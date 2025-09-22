import { logger } from "../logger";

export default () => {
  const payload = { status: "ok", time: new Date().toISOString() };
  logger.debug("Reporting status", payload);

  return payload;
};
