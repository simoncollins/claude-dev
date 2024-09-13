import * as vscode from "vscode"
import fs from "fs/promises"
import * as path from "path"

export async function selectImages(): Promise<string[]> {
	const options: vscode.OpenDialogOptions = {
		canSelectMany: true,
		openLabel: "Select",
		filters: {
			Images: ["png", "jpg", "jpeg", "webp"], // supported by anthropic and openrouter
		},
	}

	const fileUris = await vscode.window.showOpenDialog(options)

	if (!fileUris || fileUris.length === 0) {
		return []
	}

	const filePaths = fileUris.map(uri => uri.fsPath)
    return await convertFilesToBase64(filePaths)
}

async function convertFilesToBase64(filePaths: string[]): Promise<string[]> {
    return await Promise.all(
        filePaths.map(async (filePath) => {
            const buffer = await fs.readFile(filePath)
            const base64 = buffer.toString("base64")
            const mimeType = getMimeType(filePath)
            const dataUrl = `data:${mimeType};base64,${base64}`
            return dataUrl
        })
    )
}

function getMimeType(filePath: string): string {
	const ext = path.extname(filePath).toLowerCase()
	switch (ext) {
		case ".png":
			return "image/png"
		case ".jpeg":
		case ".jpg":
			return "image/jpeg"
		case ".webp":
			return "image/webp"
		default:
			throw new Error(`Unsupported file type: ${ext}`)
	}
}
