const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// 清除旧的 dist 目录
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// 只复制非测试文件
const files = fs.readdirSync(srcDir).filter(f => !f.includes('.test.'));

files.forEach(file => {
  fs.copyFileSync(
    path.join(srcDir, file),
    path.join(distDir, file)
  );
  console.log(`Built: ${file}`);
});

console.log('Build complete!');
