import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  console.log('🧪 Test d\'upload Cloudinary...');

  // Créer un buffer de test simple (image rouge 1x1 pixel)
  const testBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG header
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // Compression, etc.
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00, 0x01, // Red pixel data
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82
  ]);

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'fotoljay/test',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('❌ Erreur Cloudinary:', error);
          console.error('Code:', error.http_code);
          console.error('Message:', error.message);
          console.error('Status:', error.statusCode);
        } else if (result) {
          console.log('✅ Upload réussi !');
          console.log('URL:', result.secure_url);
          console.log('Public ID:', result.public_id);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(testBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);

    // Timeout après 30 secondes
    setTimeout(() => {
      console.log('⏰ Timeout de test (30s)');
      process.exit(1);
    }, 30000);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testUpload();
