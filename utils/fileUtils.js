const fs = require('fs')
const path = require('path')

function readJSONFile(filePath) {
	const relativePath = path.relative('./', `data/${filePath}`)

	if (!fs.existsSync(relativePath)) {
		fs.writeFileSync(relativePath, '[]', 'utf8')
		return []
	}

	const fileContents = fs.readFileSync(relativePath, 'utf8')
	return JSON.parse(fileContents)
}

module.exports = {
	readJSONFile
}
