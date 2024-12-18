const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid'); // Import uuid

const uploadToCloudinary = (fileBuffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

        // Convert buffer to readable stream and pipe it to Cloudinary
        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const uniqueName = `${uuidv4()}-${Date.now()}`;
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: 'uploads',
            public_id: req.body.public_id || uniqueName,
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
        });

        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};

module.exports = { uploadImage };