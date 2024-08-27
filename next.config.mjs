/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'news.google.com',
                pathname: '/api/attachments/**'
            },
            {
                protocol: 'https',
                hostname: 'i.zedtranslate.com',
                pathname: '/newsimage/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
