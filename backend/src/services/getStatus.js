import { logger } from "../logger.js";

export default () => {
  logger.debug("Getting status");
  const payload = { status: "ok", time: new Date().toISOString() };
  logger.info("Status retrieved", { payload });

  return payload;
};
