const config = {
  siteUrl: process.env.SITE_URL || 'https://rejangpedia.vercel.app/',
  generateRobotsTxt: true, // Membuat robots.txt secara otomatis
  changefreq: 'daily', // Seberapa sering konten berubah
  priority: 0.7, // Prioritas URL (skala 0-1)
  sitemapSize: 5000, // Jumlah maksimum URL per file sitemap
  generateIndexSitemap: true,
  exclude: ['/admin', '/ongoing/*'], // Halaman yang tidak ingin disertakan
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/ongoing'] },
    ],
  },
};

export default config;
