const fs = require('fs');
const path = require('path');

// 1x1 piksel geçerli PNG (base64 encoded)
const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
);

const dir = path.join(__dirname, 'tests', 'fixtures');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'test-image.png'), minimalPNG);
console.log(' Test resmi oluşturuldu: tests/fixtures/test-image.png');
