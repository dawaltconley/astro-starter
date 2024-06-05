import type { PagesBlocksLogoWall } from '@tina/__generated__/types'
import type { PagesBlockProps } from './index'
import LogoWall from '@components/LogoWall'
import { isTruthy } from '@lib/utils'

interface LogoWallBlockProps extends PagesBlockProps {
  block: PagesBlocksLogoWall
}

export default function LogoWallBlock({ block, images }: LogoWallBlockProps) {
  return (
    <LogoWall
      images={block.logos
        .map((l) => ({
          src: l.logo,
          alt: l.organization || '',
        }))
        .filter(isTruthy)}
      responsiveImages={images}
    />
  )
}
