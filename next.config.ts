import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: true,
			},
		];
	},
	images: {
		domains: ['res.cloudinary.com'],
	},
};

export default nextConfig;
