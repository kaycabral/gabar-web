import { BRAZIL_REGIONS, type BrazilianRegion } from '../types/exam'

export function deriveRegion(state: string): BrazilianRegion {
  for (const [region, states] of Object.entries(BRAZIL_REGIONS)) {
    if (states.includes(state)) return region as BrazilianRegion
  }
  return 'Central-West'
}
