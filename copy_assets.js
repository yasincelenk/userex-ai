const fs = require('fs');
const path = require('path');

const sourceDir = "/Users/yasin.celenk/.gemini/antigravity/brain/dcc0bed5-6d99-44ca-a885-c39bdcf289d7";
const destDir = "/Users/yasin.celenk/userex-ai/public";

const mapping = {
    "uploaded_image_0_1766495277190.png": "vion-logo-text-light.png",
    "uploaded_image_1_1766495277190.png": "vion-logo-icon-light.png",
    "uploaded_image_2_1766495277190.png": "vion-logo-icon-dark.png",
    "uploaded_image_3_1766495277190.png": "vion-logo-full-dark.png",
    "uploaded_image_2_1766495277190.png": "favicon.ico"
};

console.log(`Source: ${sourceDir}`);
console.log(`Dest: ${destDir}`);

Object.entries(mapping).forEach(([srcName, destName]) => {
    const srcPath = path.join(sourceDir, srcName);
    const destPath = path.join(destDir, destName);

    try {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            const stats = fs.statSync(destPath);
            console.log(`SUCCESS: Copied ${srcName} -> ${destName} (${stats.size} bytes)`);
        } else {
            console.log(`ERROR: Source file not found: ${srcPath}`);
        }
    } catch (e) {
        console.log(`ERROR: Failed to copy ${srcName} -> ${destName}: ${e.message}`);
    }
});
