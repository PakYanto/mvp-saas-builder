import { prisma } from './prisma';

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug with collision handling
 * If slug exists, append a number (e.g., my-store-2, my-store-3)
 */
export async function generateUniqueSlug(baseText: string, excludeId?: string): Promise<string> {
  let slug = slugify(baseText);
  
  if (!slug) {
    // Fallback if slugify results in empty string
    slug = 'store-' + Date.now();
  }

  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });
    
    // If no existing project with this slug, or it's the same project we're updating
    if (!existing || (excludeId && existing.id === excludeId)) {
      return uniqueSlug;
    }
    
    // Collision detected, try with counter
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
}
