import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function getGoogleDriveFiles(folderId: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('source', 'google_drive')
      .eq('folder_id', folderId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    return [];
  }
}

export async function downloadPdfFromDrive(fileId: string): Promise<Blob | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GOOGLE_DRIVE_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to download PDF');
    return await response.blob();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return null;
  }
}