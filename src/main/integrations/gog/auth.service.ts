import { Service } from "typedi";

import { SharedConfigService } from "../../config/shared-config.service";

@Service()
export class GogAuthService {
  constructor(private readonly sharedConfigService: SharedConfigService) {}
}
