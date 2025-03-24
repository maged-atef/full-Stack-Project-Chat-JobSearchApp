import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';






export const multerLocal = () => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const uploadDir = path.join(__dirname, '../uploads'); // Adjust path if needed
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Ensure folder exists
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, nanoid(5) + '-' + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/' || file.mimetype == 'application/text')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only PDFs and images are allowed'), false);
        }
    };

    const upload = multer({ storage, fileFilter });
    return upload;
};
