import CardBasic, { type CardBasicProps } from './CardBasic'
import ImageCard, { type ImageCardProps } from './ImageCard'

export default function Card(
  props: (CardBasicProps & { image?: null }) | ImageCardProps,
) {
  return 'image' in props && props.image ? ImageCard(props) : CardBasic(props)
}
