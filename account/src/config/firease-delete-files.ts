import { firebaseAdmin } from ".."

async function deleteFilesByPrefix(prefix: string): Promise<void> {
	try {
		// List all files with the given prefix
		const [files] = await firebaseAdmin.storage().bucket().getFiles({ prefix })

		if (files.length === 0) {
			console.log(`No files found with prefix ${prefix}`)
			return
		}

		// Delete all files in the folder
		const deletePromises = files.map(file => file.delete())
		await Promise.all(deletePromises)
	} catch (error) {
		console.error('Error deleting files:', error)
	}
}

export { deleteFilesByPrefix }
