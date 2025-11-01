import { logger } from "../logger.js";

export default async (_req, res) => {
  logger.debug("Uploading files...");

  await new Promise(resolve => setTimeout(resolve, 1000));

  res.json({ uploadId: "1234567890" });
};
