// app/api/upload/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const uploadFileSchema = z.object({
  name: z.string().min(1, 'Nom de fichier requis'),
  size: z.number().max(5 * 1024 * 1024, 'Le fichier ne doit pas dépasser 5MB'),
  type: z.string().refine(
    (type) => [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'application/pdf'
    ].includes(type),
    'Type de fichier non autorisé. Utilisez JPG, PNG, GIF, WebP ou PDF.'
  )
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    const validatedData = uploadFileSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    });

    const uploadDir = path.join(process.cwd(), 'public/uploads/cadastre/');
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.name);
    const filename = `profile-${uniqueSuffix}${extension}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/cadastre/${filename}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du téléchargement' },
      { status: 500 }
    );
  }
}