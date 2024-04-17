import multer from "multer"
import path from "path"
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { TCloudinaryResponse, TFile } from "../app/interfaces/file";

cloudinary.config({
    cloud_name: 'dwdp6ikyh',
    api_key: '951666232978394',
    api_secret: 'chfrkYxs4sb_nWd1rb0Lgx58BUI'
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });


const uploadToCloudinary = async (file: TFile): Promise<TCloudinaryResponse | undefined> => {
    return new Promise((resolve, rejects) => {
        cloudinary.uploader.upload(file.path,
            // { public_id: file.originalname },
            (error: Error, result: TCloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    rejects(error)
                }
                else {
                    resolve(result)
                }
            }
        )
    })


};



export const fileUploader = {
    upload,
    uploadToCloudinary
}