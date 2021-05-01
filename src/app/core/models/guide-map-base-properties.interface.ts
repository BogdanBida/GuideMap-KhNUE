import { GuideMapFeaturePointCategory } from '../enums';

export interface GuideMapBaseProperties {
  readonly id: number;
  readonly name: string;
  readonly category: GuideMapFeaturePointCategory;
}
