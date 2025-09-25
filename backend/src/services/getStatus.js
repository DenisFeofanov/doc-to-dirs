import { logger } from "../logger.js";

export default () => {
  logger.debug("Getting status");

  const status = { backendCondition: "ok", time: new Date().toISOString() };
  logger.info("Status retrieved", { status: status });

  return status;
};
