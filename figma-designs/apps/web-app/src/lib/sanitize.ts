/**
 * HTML sanitization utility using DOMPurify
 * Prevents XSS attacks when rendering user-generated content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe tags for text formatting and highlights
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'mark', 'span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * Sanitize rich content HTML (for blog posts, descriptions)
 * Allows more tags but still strips dangerous content
 */
export function sanitizeRichContent(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'b', 'i', 'em', 'strong', 'mark', 'span',
      'a', 'code', 'pre', 'blockquote',
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
    // Force all links to have safe attributes
    ADD_ATTR: ['target', 'rel'],
    FORCE_BODY: true,
  });
}

/**
 * Sanitize and return object for dangerouslySetInnerHTML
 */
export function createSafeHtml(dirty: string): { __html: string } {
  return { __html: sanitizeHtml(dirty) };
}

/**
 * Sanitize rich content and return object for dangerouslySetInnerHTML
 */
export function createSafeRichHtml(dirty: string): { __html: string } {
  return { __html: sanitizeRichContent(dirty) };
}
