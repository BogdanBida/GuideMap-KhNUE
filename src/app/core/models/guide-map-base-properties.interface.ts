import { GuideMapFeaturePointCategory } from '../enums';

export interface GuideMapBaseProperties {
  readonly id: string;
  readonly name: string;
  readonly category: GuideMapFeaturePointCategory;
  readonly floor: number;
}
