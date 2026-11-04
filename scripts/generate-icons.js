import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(size, primaryColor = [163, 255, 112], bgColor = [17, 19, 24]) {
  const width = size;
  const height = size;
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filter byte (0)
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Draw border & an "X" or square symbol
      const isBorder = x === 0 || x === width - 1 || y === 0 || y === height - 1;
      const isCenterSquare = (x >= Math.floor(size * 0.25) && x <= Math.floor(size * 0.75)) &&
                             (y >= Math.floor(size * 0.25) && y <= Math.floor(size * 0.75));
      const isDiagonal = Math.abs(x - y) <= Math.max(1, Math.floor(size * 0.08)) || 
                         Math.abs((width - 1 - x) - y) <= Math.max(1, Math.floor(size * 0.08));

      if (isBorder || (isCenterSquare && isDiagonal)) {
        rawData[pxOffset] = primaryColor[0];
        rawData[pxOffset + 1] = primaryColor[1];
        rawData[pxOffset + 2] = primaryColor[2];
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = bgColor[0];
        rawData[pxOffset + 1] = bgColor[1];
        rawData[pxOffset + 2] = bgColor[2];
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  
  // Calculate CRC32
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Precomputed CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const iconsDir = path.resolve('public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

[16, 48, 128].forEach(size => {
  const png = createPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
});

