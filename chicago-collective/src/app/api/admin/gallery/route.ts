import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'gallery.json');

// Ensure data directory exists
async function ensureDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Ignore error if it already exists
  }
}

export async function GET() {
  try {
    await ensureDir();
    const data = await fs.readFile(dataFile, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    // If file doesn't exist, return empty object
    if (error.code === 'ENOENT') {
      return NextResponse.json({});
    }
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await ensureDir();
    let existingData = {};
    try {
      const data = await fs.readFile(dataFile, 'utf-8');
      existingData = JSON.parse(data);
    } catch (e) {
      // Ignore if file doesn't exist yet
    }

    const newData = { ...existingData, ...body };
    
    await fs.writeFile(dataFile, JSON.stringify(newData, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
