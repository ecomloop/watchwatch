module.exports = {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"
  title: 'watchwatch.org', // Navigation and Site Title
  titleAlt: 'watchwatch', // Title for JSONLD
  description: 'ddocumenting police brutality against lawful protesters',
  url: 'https://watchwatch.org', // Domain of your site. No trailing slash!
  siteUrl: 'https://watchwatch.org/', // url + pathPrefix
  siteLanguage: 'en', // Language Tag on <html> element
  logo: '/static/logo/logo.png', // Used for SEO
  banner: '/static/logo/logo.png',
  // JSONLD / Manifest
  favicon: 'static/logo/favicon.png', // Used for manifest favicon generation
  shortName: 'watchwatch', // shortname for manifest. MUST be shorter than 12 characters
  author: 'ecomloop.com', // Author for schemaORGJSONLD
  themeColor: '#6f6add',
  backgroundColor: '#6f6add',
  twitter: '@ecomloop', // Twitter Username
};
