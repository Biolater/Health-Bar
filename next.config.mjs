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
                pathname: '/profile-pictures/**',
            },
            {
                protocol: 'https',
                hostname: 'amplify-d35n0mu3dfg9d4-ma-healthbarusersdrivebucke-rcmzlwvcvj3k.s3.eu-central-1.amazonaws.com',
                pathname: '/profile-pictures/**',
            }
        ]
    }
};

export default nextConfig;
