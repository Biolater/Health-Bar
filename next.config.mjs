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
                hostname: 'amplify-awsamplifygen2-yu-healthbarusersdrivebucke-fn1uis3g9jsr.s3.eu-central-1.amazonaws.com',
                pathname: '/profile-pictures/**', // More precise path for your S3 bucket
            }
        ]
    }
};

export default nextConfig;
