const fs = require('fs')
const path = require('path')

function readJSONFile(filePath) {
	const relativePath = path.relative('./', `data/${filePath}`)

	if (!fs.existsSync(relativePath)) {
		fs.writeFileSync(relativePath, '[]', 'utf8')
		return { data: [], status: 201 }
	}

	const fileContents = fs.readFileSync(relativePath, 'utf8')
	return { data: JSON.parse(fileContents), status: 200 }
}

module.exports = {
	readJSONFile
}
