import formidable from 'formidable';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

const useSupabase = () => {
    const config = useRuntimeConfig();

    if (!supabaseClient) {
        supabaseClient = createClient(
            config.public.supabaseUrl,
            config.public.supabaseKey
        );
    }

    return supabaseClient;
};

// Function to generate filename with timestamp
const generateITFilename = (originalFilename) => {
    const date = new Date();
    
    // สร้าง timestamp ในรูปแบบ YYYYMMDD_HHmmss
    const timestamp = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0') + '_' +
        date.getHours().toString().padStart(2, '0') +
        date.getMinutes().toString().padStart(2, '0') +
        date.getSeconds().toString().padStart(2, '0');
    
    // เพิ่ม milliseconds เพื่อป้องกันการซ้ำในกรณีที่มีการอัพโหลดพร้อมกัน
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    
    // ดึงนามสกุลไฟล์
    const extension = originalFilename.split('.').pop();
    
    // รวมเป็นชื่อไฟล์: IT_YYYYMMDD_HHmmss_SSS.ext
    return `IT_${timestamp}_${ms}.${extension}`;
};

export default defineEventHandler(async (event) => {
    const supabase = useSupabase();

    const form = formidable({
        multiples: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        filename: (name, ext, part) => {
            return generateITFilename(part.originalFilename);
        }
    });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(event.node.req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const fileArray = files.file ? (Array.isArray(files.file) ? files.file : [files.file]) : [];

        const uploadResults = await Promise.all(fileArray.map(async (file) => {
            const fileBuffer = await fs.readFile(file.filepath);

            const { data, error } = await supabase.storage.from('upload').upload(`uploads/${file.newFilename}`, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype
            });

            if (error) throw error;

            return {
                fileName: file.newFilename,
                originalName: file.originalFilename,
                filePath: `https://fincypnvaknqnehfmppk.supabase.co/storage/v1/object/public/upload/uploads/${file.newFilename}`,
            };
        }));

        return {
            status: 'success',
            data: uploadResults
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            status: 'error',
            message: error.message
        };
    }
});