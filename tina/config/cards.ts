import type { Option } from './fields'
import type { CardStyle } from '../../src/components/ImageCard'

export interface CardLayoutOptions extends Option {
  value: CardStyle
}

export const cardLayoutOptions: CardLayoutOptions[] = [
  {
    value: 'card',
    label: 'Card',
  },
  {
    value: 'tile',
    label: 'Tile',
  },
]
