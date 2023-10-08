import { Injectable } from '@nestjs/common';
import { lookupCollection, lookupCollections } from '@iconify/json';

@Injectable()
export class IconifyService {
  constructor() {}

  test() {
    return 'work';
  }

  async collections() {
    const data = await lookupCollections();
    return Object.entries(data).map(([key, value]) => ({ ...value, key }));
  }

  async lookupCollections(prefix: string) {
    return lookupCollection(prefix);
  }
}
