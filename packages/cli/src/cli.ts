/*
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 15:55 Monday
*/

import Service from "./Service";
import logger from "./logger";

const service = new Service(process.cwd());
try {
  service.run();
} catch (error) {
  logger.error(error.message, error);
  process.exit(1);
}
