// app/api/sign-cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET() {
	try {
		// Get the timestamp in seconds
		const timestamp = Math.round(new Date().getTime() / 1000);

		// Get the signature
		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp: timestamp,
			},
			process.env.CLOUDINARY_SECRET!
		);

		return NextResponse.json({ signature, timestamp });
	} catch (error) {
		console.error('Error generating Cloudinary signature:', error);
		return NextResponse.json(
			{ error: 'Failed to generate signature' },
			{ status: 500 }
		);
	}
}
