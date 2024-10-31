// server/api/upload.post.js
import formidable from 'formidable';
import fs from 'fs/promises'; // Use promises API to read files
import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

// Supabase composable function
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

export default defineEventHandler(async (event) => {
    const supabase = useSupabase(); // Initialize Supabase client

    const form = formidable({
        multiples: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        filename: (name, ext, part) => {
            return `${Date.now()}-${part.originalFilename}`;
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
            // Read the file as a buffer
            const fileBuffer = await fs.readFile(file.filepath);

            // Upload to Supabase
            const { data, error } = await supabase.storage.from('upload').upload(`uploads/${file.newFilename}`, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype // Ensure correct MIME type
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
