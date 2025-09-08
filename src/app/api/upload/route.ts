// app/api/upload/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

    // Validation des données
    const validatedData = uploadFileSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Génération du nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.name.split('.').pop();
    const filename = `profile-${uniqueSuffix}.${extension}`;

    // Upload vers Vercel Blob
    const blob = await put(`cadastre/${filename}`, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      url: blob.url,
      downloadUrl: blob.downloadUrl 
    }, { status: 200 });

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