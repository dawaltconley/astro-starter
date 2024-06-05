/** @typedef {import('@lib/links').Link} Link */

/**
 * @typedef {Object} SiteConfig
 * @property {string} SiteConfig.title
 * @property {string} SiteConfig.description
 * @property {URL} SiteConfig.domain
 * @property {string} [SiteConfig.ogImage]
 * @property {string} [SiteConfig.favicon]
 */

/** @type {SiteConfig} */
export const SITE = {
  title: 'Starter site',
  description: 'Site description',
  domain: new URL('https://example.com'),
  ogImage: undefined,
  favicon: '/favicon.svg',
}

/** @type {(string | URL)[]} */
export const SOCIALS = []
