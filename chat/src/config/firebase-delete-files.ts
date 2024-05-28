import { getBucket } from "./firebase";



async function deleteFilesByPrefix(prefix: string): Promise<void> {
  try {
    // List all files with the given prefix
    const [files] = await getBucket().getFiles({ prefix });


    if (files.length === 0) {
        console.log(`No files found with prefix ${prefix}`);
        return;
      }

    // Delete all files in the folder
    const deletePromises = files.map(file => file.delete());
    await Promise.all(deletePromises);

    console.log(`All files with prefix ${prefix} deleted successfully`);
  } catch (error) {
    console.error('Error deleting files:', error);
  }
}

export { deleteFilesByPrefix };