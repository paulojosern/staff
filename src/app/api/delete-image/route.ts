// app/api/destroy-image/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const name = searchParams.get('name');

		if (!name) {
			return NextResponse.json(
				{ error: 'Image name is required' },
				{ status: 400 }
			);
		}

		const result = await cloudinary.uploader.destroy(name);

		return NextResponse.json({ result });
	} catch (error) {
		console.error('Error deleting image:', error);
		return NextResponse.json(
			{ error: 'Failed to delete image' },
			{ status: 500 }
		);
	}
}
