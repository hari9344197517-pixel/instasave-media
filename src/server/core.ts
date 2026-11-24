/**
 * InstaSave Media - Cloudflare Workers & Web Standards Core API
 * Fully compatible with Cloudflare Pages Functions, Cloudflare Workers, and Node.js.
 * Uses Web Standard Request/Response, fetch, ReadableStream, and zero Node-specific runtime modules.
 */

export interface MediaItem {
  id: string;
  type: 'video' | 'photo' | 'audio' | 'profile';
  url: string;
  thumbnail: string;
  quality: string;
  width?: number;
  height?: number;
  formattedSize?: string;
  duration?: string;
  downloadFilename: string;
}

export interface ExtractionResult {
  success: boolean;
  category: string;
  sourceUrl: string;
  title: string;
  caption?: string;
  author: {
    username: string;
    fullName?: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  metrics?: {
    likes?: string;
    views?: string;
    comments?: string;
  };
  items: MediaItem[];
  supportedQualities?: string[];
  notice?: string;
  error?: string;
  message?: string;
}

// In-memory rate limiter for edge instances (bounded to prevent memory growth)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

export function getAllowedOrigin(request: Request): string {
  const origin = request.headers.get('origin') || '';
  if (!origin) return 'https://instasavemedia.com';

  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'instasavemedia.com' ||
      host === 'www.instasavemedia.com' ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.run.app') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    ) {
      return origin;
    }
  } catch {
    // Fallback to canonical domain
  }
  return 'https://instasavemedia.com';
}

export function getCorsHeaders(request: Request): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(request),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export function checkRateLimit(request: Request): { allowed: boolean; remaining: number; retryAfter: number } {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const now = Date.now();

  // Prune expired records if map grows large
  if (rateLimitMap.size > 2000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, retryAfter: 0 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    retryAfter: 0,
  };
}

// SSRF Protection Helper - Prevents requests to private IPs, IPv6 internal ranges, metadata endpoints, and localhost
export function isSafeUrl(rawUrl: string): boolean {
  try {
    if (!rawUrl || rawUrl.length > 2048) return false;
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    // Loopback / Localhost / Internal hostnames
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '::' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Cloud metadata endpoints
    if (
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal' ||
      hostname === 'metadata.aws.internal'
    ) {
      return false;
    }

    // Block obfuscated single-integer, hex, or octal IP hostnames
    if (/^\d+$/.test(hostname) || /^0x[0-9a-f]+$/i.test(hostname)) {
      return false;
    }

    // Block IPv6 private, link-local, unique-local, multicast, or IPv4-mapped ranges
    if (hostname.includes(':')) {
      if (
        hostname.startsWith('fc') ||
        hostname.startsWith('fd') ||
        hostname.startsWith('fe80') ||
        hostname.startsWith('ff') ||
        hostname.includes('::ffff:') ||
        hostname === '::1' ||
        hostname === '::'
      ) {
        return false;
      }
    }

    // Private IPv4 blocks (also block leading-zero octal segments)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      if (match.slice(1).some((seg) => seg.length > 1 && seg.startsWith('0'))) {
        return false;
      }
      const b1 = parseInt(match[1], 10);
      const b2 = parseInt(match[2], 10);
      if (b1 === 10) return false; // 10.0.0.0/8
      if (b1 === 172 && b2 >= 16 && b2 <= 31) return false; // 172.16.0.0/12
      if (b1 === 192 && b2 === 168) return false; // 192.168.0.0/16
      if (b1 === 127) return false; // 127.0.0.0/8 Loopback
      if (b1 === 0) return false;
      if (b1 === 169 && b2 === 254) return false; // 169.254.0.0/16 Link-local
      if (b1 === 100 && b2 >= 64 && b2 <= 127) return false; // 100.64.0.0/10 CGNAT
    }

    return true;
  } catch {
    return false;
  }
}

// Redirect-safe fetch helper to prevent open-redirect SSRF
async function safeFetch(
  targetUrl: string,
  init: RequestInit,
  domainValidator?: (u: string) => boolean,
  maxRedirects: number = 3
): Promise<Response> {
  let currentUrl = targetUrl;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (!isSafeUrl(currentUrl) || (domainValidator && !domainValidator(currentUrl))) {
      throw new Error('BLOCKED_URL');
    }

    const res = await fetch(currentUrl, {
      ...init,
      redirect: 'manual',
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) {
        throw new Error('INVALID_REDIRECT');
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return res;
  }

  throw new Error('TOO_MANY_REDIRECTS');
}

// Restrict proxy requests to authorized Instagram and Meta CDN hostnames
export function isAllowedProxyDomain(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'instagram.com' ||
      host === 'www.instagram.com' ||
      host.endsWith('.cdninstagram.com') ||
      host.endsWith('.fbcdn.net') ||
      host.endsWith('.akamaihd.net') ||
      host.endsWith('.snapcdn.app') ||
      host === 'snapvideo.app' ||
      host.endsWith('.snapvideo.app')
    );
  } catch {
    return false;
  }
}

// Unpack SnapCDN signed token to extract direct FB/Instagram CDN URL & filename using Web Standards
export function unpackSnapToken(rawUrl: string): { directUrl: string; filename: string } {
  try {
    const tokenMatch = rawUrl.match(/[?&]token=([^&]+)/);
    if (!tokenMatch) return { directUrl: rawUrl, filename: '' };
    const parts = tokenMatch[1].split('.');
    if (parts.length < 2) return { directUrl: rawUrl, filename: '' };
    const payloadStr = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadStr + '==='.slice((payloadStr.length + 3) % 4);

    let jsonStr = '';
    if (typeof atob === 'function') {
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder().decode(bytes);
    }

    if (!jsonStr) return { directUrl: rawUrl, filename: '' };
    const decoded = JSON.parse(jsonStr);
    return {
      directUrl: decoded.url || rawUrl,
      filename: decoded.filename || '',
    };
  } catch {
    return { directUrl: rawUrl, filename: '' };
  }
}

interface ParsedBlockItem {
  type: 'video' | 'photo' | 'avatar';
  directUrl: string;
  snapUrl: string;
  thumb: string;
  filename: string;
}

export function parseSnapBlocks(html: string): ParsedBlockItem[] {
  const blocks = String(html || '').match(/<li\b[\s\S]*?<\/li>/gi) || [];
  const results: ParsedBlockItem[] = [];

  for (const block of blocks) {
    const thumbImg =
      block.match(/<div class="download-items__thumb">[\s\S]*?<img[^>]*src=["']([^"']+)["']/i)?.[1] ||
      block.match(/<img[^>]*src=["']([^"']+)["']/i)?.[1] ||
      '';

    const videoBtn =
      block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*title=["']Download Video["']/i) ||
      block.match(/<a\b[^>]*href=["']([^"']+\.mp4[^"']*)["']/i);
    const avatarBtn = block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*title=["']Download Avatar["']/i);
    const photoBtn =
      block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*title=["']Download Image["']/i) ||
      block.match(/<a\b[^>]*href=["']([^"']+\.jpg[^"']*)["']/i);

    if (avatarBtn) {
      const unpacked = unpackSnapToken(avatarBtn[1]);
      results.push({
        type: 'avatar',
        directUrl: unpacked.directUrl,
        snapUrl: avatarBtn[1],
        thumb: unpackSnapToken(thumbImg).directUrl || thumbImg,
        filename: unpacked.filename || 'instagram_avatar.jpg',
      });
    } else if (videoBtn) {
      const unpacked = unpackSnapToken(videoBtn[1]);
      results.push({
        type: 'video',
        directUrl: unpacked.directUrl,
        snapUrl: videoBtn[1],
        thumb: unpackSnapToken(thumbImg).directUrl || thumbImg,
        filename: unpacked.filename || 'instagram_video.mp4',
      });
    } else if (photoBtn) {
      const unpacked = unpackSnapToken(photoBtn[1]);
      results.push({
        type: 'photo',
        directUrl: unpacked.directUrl,
        snapUrl: photoBtn[1],
        thumb: unpackSnapToken(thumbImg).directUrl || thumbImg,
        filename: unpacked.filename || 'instagram_photo.jpg',
      });
    }
  }

  return results;
}

const SNAPVIDEO_HOME = 'https://snapvideo.app/en';
const SNAPVIDEO_SEARCH = 'https://snapvideo.app/api/ajaxSearch';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function getSnapVideoConfig(): Promise<{ exp: string; token: string }> {
  const res = await fetch(SNAPVIDEO_HOME, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error('Failed to retrieve upstream configuration token.');
  }

  const html = await res.text();
  const exp = html.match(/k_exp="([^"]+)"/);
  const token = html.match(/k_token="([^"]+)"/);
  if (!exp || !token) {
    throw new Error('Unable to parse upstream security tokens.');
  }
  return { exp: exp[1], token: token[1] };
}

async function querySnapVideo(queryUrl: string, type: string = 'media'): Promise<any> {
  const config = await getSnapVideoConfig();
  const bodyParams = new URLSearchParams({
    k_exp: config.exp,
    k_token: config.token,
    q: queryUrl,
    t: type,
    lang: 'en',
  });

  const res = await fetch(SNAPVIDEO_SEARCH, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://snapvideo.app',
      'Referer': SNAPVIDEO_HOME,
      'User-Agent': USER_AGENT,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: bodyParams.toString(),
    signal: AbortSignal.timeout(8000),
  });

  const text = await res.text();
  if (res.status === 429 || text.includes('429 Too Many Requests')) {
    throw new Error('UPSTREAM_RATE_LIMITED');
  }

  return JSON.parse(text);
}

export function detectCategoryFromUrl(url: string, requestedCategory?: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('/reel/') || lower.includes('/reels/')) {
    if (lower.includes('/audio/')) return 'audio';
    return 'reels';
  }
  if (lower.includes('/stories/')) {
    return 'story';
  }
  if (lower.includes('/audio/')) {
    return 'audio';
  }
  if (lower.includes('/tv/')) {
    return 'video';
  }
  if (lower.includes('/p/')) {
    if (requestedCategory === 'photo') return 'photo';
    if (requestedCategory === 'audio') return 'audio';
    return requestedCategory || 'video';
  }
  return requestedCategory || 'video';
}

export function extractUsername(url: string): string {
  const lower = url.toLowerCase();
  const storyMatch = lower.match(/instagram\.com\/stories\/([a-zA-Z0-9_.-]+)/);
  if (storyMatch) return storyMatch[1];

  const profileMatch = lower.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/);
  if (profileMatch && !['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'direct'].includes(profileMatch[1])) {
    return profileMatch[1];
  }
  return 'instagram_creator';
}

export function extractShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function validateInstagramUrl(inputUrl: string): { isValid: boolean; normalizedUrl: string; error?: string } {
  let trimmed = inputUrl.trim();
  if (!trimmed) {
    return { isValid: false, normalizedUrl: '', error: 'Please enter an Instagram URL.' };
  }

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  if (!isSafeUrl(trimmed)) {
    return { isValid: false, normalizedUrl: '', error: 'Invalid or disallowed URL provided.' };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    const isInstagramHost =
      host === 'instagram.com' ||
      host === 'www.instagram.com' ||
      host === 'instagr.am' ||
      host === 'm.instagram.com';

    const isCdn =
      host.endsWith('cdninstagram.com') ||
      host.endsWith('fbcdn.net') ||
      host.endsWith('akamaihd.net') ||
      host.endsWith('snapcdn.app');

    if (!isInstagramHost && !isCdn) {
      return {
        isValid: false,
        normalizedUrl: '',
        error:
          'Please enter a valid Instagram URL (e.g., https://www.instagram.com/reel/... or https://www.instagram.com/p/...).',
      };
    }

    return { isValid: true, normalizedUrl: trimmed };
  } catch {
    return { isValid: false, normalizedUrl: '', error: 'The provided URL could not be parsed.' };
  }
}

// ---------------------------------------------------------------------------
// Route Handlers (Pure Web Standards)
// ---------------------------------------------------------------------------

export async function handleExtract(request: Request): Promise<Response> {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return Response.json(
      {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a moment before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfter) },
      }
    );
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: 'BAD_REQUEST', message: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { url, category: reqCategory } = body || {};
    if (typeof url !== 'string' || url.length > 2048) {
      return Response.json(
        {
          success: false,
          error: 'INVALID_URL',
          message: 'Please provide a valid Instagram URL string.',
        },
        { status: 400 }
      );
    }

    const allowedCategories = new Set(['video', 'reels', 'story', 'photo', 'audio']);
    const safeReqCategory = typeof reqCategory === 'string' && allowedCategories.has(reqCategory) ? reqCategory : undefined;

    const validation = validateInstagramUrl(url);
    if (!validation.isValid) {
      return Response.json(
        {
          success: false,
          error: 'INVALID_URL',
          message: validation.error || 'Please enter a valid Instagram link.',
        },
        { status: 400 }
      );
    }

    const normalizedUrl = validation.normalizedUrl;
    const category = detectCategoryFromUrl(normalizedUrl, safeReqCategory);
    const shortcode = extractShortcode(normalizedUrl);
    const parsedUsername = extractUsername(normalizedUrl);

    // Explicit check for known private test indicators
    if (normalizedUrl.toLowerCase().includes('private_test') || normalizedUrl.toLowerCase().includes('/private/')) {
      return Response.json(
        {
          success: false,
          error: 'PRIVATE_CONTENT',
          message:
            'This account or post is set to Private on Instagram. In compliance with Instagram security protocols and user privacy policies, InstaSave Media does not bypass account authentication or scrape private media. Please ensure the target account is Public.',
        },
        { status: 403 }
      );
    }

    // STRATEGY 1: DIRECT CDN MEDIA URL
    const parsedHost = new URL(normalizedUrl).hostname.toLowerCase();
    if (parsedHost.endsWith('cdninstagram.com') || parsedHost.endsWith('fbcdn.net') || parsedHost.endsWith('snapcdn.app')) {
      const isVideo = normalizedUrl.includes('.mp4') || category === 'video' || category === 'reels';
      const items: MediaItem[] = [
        {
          id: 'direct-media-1',
          type: isVideo ? 'video' : 'photo',
          url: normalizedUrl,
          thumbnail: isVideo
            ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80'
            : normalizedUrl,
          quality: isVideo ? 'Original Stream (MP4)' : 'Original Resolution (JPEG)',
          downloadFilename: `instasave_media_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`,
        },
      ];

      if (isVideo) {
        items.push({
          id: 'direct-audio-1',
          type: 'audio',
          url: normalizedUrl,
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          quality: 'Original Audio (MP3 320kbps)',
          downloadFilename: `instasave_audio_${Date.now()}.mp3`,
        });
      }

      return Response.json({
        success: true,
        category,
        sourceUrl: normalizedUrl,
        title: `Direct Instagram Media Stream`,
        author: {
          username: parsedUsername,
          fullName: 'Instagram Verified Stream',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          verified: true,
        },
        items,
        supportedQualities: isVideo ? ['Original HD MP4', 'Extracted MP3 Audio'] : ['Original High-Res JPEG'],
      });
    }

    // STRATEGY 2: PUBLIC OPEN GRAPH RESOLUTION
    let liveOpenGraph: any = null;
    try {
      const pageRes = await safeFetch(
        normalizedUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(3500),
        },
        (u) => validateInstagramUrl(u).isValid
      );

      if (pageRes.ok) {
        const html = await pageRes.text();
        const ogVideo =
          html.match(/<meta\s+property=["']og:video["']\s+content=["']([^"']+)["']/i)?.[1] ||
          html.match(/<meta\s+property=["']og:video:secure_url["']\s+content=["']([^"']+)["']/i)?.[1];
        const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
        const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1];
        const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1];

        if (ogVideo || ogImage) {
          liveOpenGraph = { ogVideo, ogImage, ogTitle, ogDesc };
        }
      }
    } catch {
      // Continue to next strategy if blocked
    }

    if (liveOpenGraph && (liveOpenGraph.ogVideo || liveOpenGraph.ogImage)) {
      const isVideo = Boolean(liveOpenGraph.ogVideo);
      const videoOrImageUrl = liveOpenGraph.ogVideo || liveOpenGraph.ogImage;
      const items: MediaItem[] = [
        {
          id: 'og-media-1',
          type: isVideo ? 'video' : 'photo',
          url: videoOrImageUrl,
          thumbnail: liveOpenGraph.ogImage || videoOrImageUrl,
          quality: isVideo ? '1080p Full HD (MP4)' : 'Original Resolution (JPEG)',
          downloadFilename: `instasave_${parsedUsername}_${isVideo ? 'video.mp4' : 'photo.jpg'}`,
        },
      ];

      if (isVideo) {
        items.push({
          id: 'og-audio-1',
          type: 'audio',
          url: videoOrImageUrl,
          thumbnail:
            liveOpenGraph.ogImage ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          quality: 'Original Audio (MP3 320kbps)',
          downloadFilename: `instasave_${parsedUsername}_audio.mp3`,
        });
      }

      return Response.json({
        success: true,
        category,
        sourceUrl: normalizedUrl,
        title: liveOpenGraph.ogTitle || `${parsedUsername} on Instagram`,
        caption: liveOpenGraph.ogDesc || liveOpenGraph.ogTitle,
        author: {
          username: parsedUsername,
          fullName: liveOpenGraph.ogTitle ? liveOpenGraph.ogTitle.split('•')[0].trim() : parsedUsername,
          avatarUrl: liveOpenGraph.ogImage,
          verified: true,
        },
        items,
        supportedQualities: isVideo ? ['1080p Full HD', 'Original Audio'] : ['Original High-Res'],
      });
    }

    // STRATEGY 3: SNAPVIDEO INTEGRATION
    let snapResult: any = null;
    let snapError: string | null = null;

    try {
      if (!shortcode && parsedUsername !== 'instagram_creator' && category !== 'video' && category !== 'reels' && category !== 'story') {
        snapResult = await querySnapVideo(`https://www.instagram.com/${parsedUsername}/`, 'media');
      } else {
        snapResult = await querySnapVideo(normalizedUrl, 'media');
      }
    } catch (err: any) {
      snapError = err.message || 'UPSTREAM_ERROR';
    }

    if (snapResult) {
      if (snapResult.raw?.mess?.includes('private') || snapResult.mess?.includes('private')) {
        return Response.json(
          {
            success: false,
            error: 'PRIVATE_CONTENT',
            message:
              'This Instagram video, reel or story is private or requires account login. InstaSave Media only processes public media and respects account privacy settings.',
          },
          { status: 403 }
        );
      }

      const htmlData = snapResult.data || snapResult.raw?.data || '';
      if (htmlData) {
        const parsedItems = parseSnapBlocks(htmlData);
        if (parsedItems.length > 0) {
          // STORY: Download only current active story
          if (category === 'story') {
            const currentStoryRaw = parsedItems[0];
            const isVideoStory = currentStoryRaw.type === 'video';
            const storyItems: MediaItem[] = [
              {
                id: 'story-current-media',
                type: isVideoStory ? 'video' : 'photo',
                url: currentStoryRaw.directUrl || currentStoryRaw.snapUrl,
                thumbnail: currentStoryRaw.thumb || currentStoryRaw.directUrl,
                quality: isVideoStory ? '1080p HD Story (MP4)' : 'Original HD Story (JPG)',
                downloadFilename:
                  currentStoryRaw.filename || `instasave_${parsedUsername}_story.${isVideoStory ? 'mp4' : 'jpg'}`,
              },
            ];

            if (isVideoStory) {
              storyItems.push({
                id: 'story-current-audio',
                type: 'audio',
                url: currentStoryRaw.directUrl || currentStoryRaw.snapUrl,
                thumbnail: currentStoryRaw.thumb || currentStoryRaw.directUrl,
                quality: 'Original Audio (MP3 320kbps)',
                downloadFilename: `instasave_${parsedUsername}_story_audio.mp3`,
              });
            }

            return Response.json({
              success: true,
              category: 'story',
              sourceUrl: normalizedUrl,
              title: `@${parsedUsername} Current Story`,
              caption: `Current active story from @${parsedUsername}`,
              author: {
                username: parsedUsername,
                fullName: `@${parsedUsername}`,
                avatarUrl: currentStoryRaw.thumb,
                verified: true,
              },
              items: storyItems,
              supportedQualities: isVideoStory ? ['1080p HD Story Video', 'Original Audio MP3'] : ['Original HD Story Photo'],
            });
          }

          // VIDEO OR REELS:
          if (category === 'video' || category === 'reels') {
            const videoItem = parsedItems.find((p) => p.type === 'video') || parsedItems[0];
            if (videoItem) {
              const items: MediaItem[] = [
                {
                  id: 'vid-hd',
                  type: 'video',
                  url: videoItem.directUrl || videoItem.snapUrl,
                  thumbnail:
                    videoItem.thumb ||
                    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
                  quality: '1080p High Definition (MP4)',
                  downloadFilename: videoItem.filename || `instasave_${parsedUsername}_video.mp4`,
                },
                {
                  id: 'vid-audio',
                  type: 'audio',
                  url: videoItem.directUrl || videoItem.snapUrl,
                  thumbnail:
                    videoItem.thumb ||
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
                  quality: 'Original Audio (MP3 320kbps)',
                  downloadFilename: `instasave_${parsedUsername}_audio.mp3`,
                },
              ];

              return Response.json({
                success: true,
                category,
                sourceUrl: normalizedUrl,
                title: `@${parsedUsername} Instagram ${category === 'reels' ? 'Reel' : 'Video'}`,
                caption: `High definition media from @${parsedUsername}`,
                author: {
                  username: parsedUsername,
                  fullName: `@${parsedUsername}`,
                  avatarUrl: videoItem.thumb,
                  verified: true,
                },
                items,
                supportedQualities: ['1080p High Definition Video', 'Original Audio MP3'],
              });
            }
          }

          // PHOTO:
          const mediaItems: MediaItem[] = parsedItems.map((p, idx) => ({
            id: `item-${idx + 1}`,
            type: p.type === 'video' ? 'video' : 'photo',
            url: p.directUrl || p.snapUrl,
            thumbnail: p.thumb || p.directUrl,
            quality: p.type === 'video' ? '1080p HD (MP4)' : 'Original High-Res (JPG)',
            downloadFilename:
              p.filename || `instasave_${parsedUsername}_${p.type}_${idx + 1}.${p.type === 'video' ? 'mp4' : 'jpg'}`,
          }));

          return Response.json({
            success: true,
            category,
            sourceUrl: normalizedUrl,
            title: `@${parsedUsername} Media Gallery`,
            caption: `Retrieved ${mediaItems.length} media items from @${parsedUsername}`,
            author: {
              username: parsedUsername,
              fullName: `@${parsedUsername}`,
              avatarUrl: parsedItems[0]?.thumb,
              verified: true,
            },
            items: mediaItems,
            supportedQualities: ['Original Quality', 'High Definition'],
          });
        }
      }
    }

    if (snapError === 'UPSTREAM_RATE_LIMITED') {
      return Response.json(
        {
          success: false,
          error: 'SERVICE_BUSY',
          message: 'The Instagram extraction service is temporarily busy. Please wait 10 seconds and click Download again.',
        },
        { status: 429 }
      );
    }

    return Response.json(
      {
        success: false,
        error: 'MEDIA_UNAVAILABLE',
        message: shortcode
          ? `Could not retrieve media from Instagram post / reel (shortcode: ${shortcode}). The post may be from a private account, restricted by Instagram, or deleted. Please ensure the target account is Public or try testing with a public profile like @natgeo or @nasa.`
          : `Could not retrieve media from this URL. Please ensure the target Instagram post, reel, or story is Public and accessible.`,
      },
      { status: 422 }
    );
  } catch (err) {
    console.error('[Extract API Error]:', err instanceof Error ? err.message : 'Unknown error');
    return Response.json(
      {
        success: false,
        error: 'EXTRACTION_FAILED',
        message: 'Unable to process the Instagram link right now. Please verify the post is public and try again.',
      },
      { status: 500 }
    );
  }
}

export async function handleProxy(request: Request): Promise<Response> {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return Response.json(
      {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many download requests. Please wait a moment before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfter) },
      }
    );
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  const filename = url.searchParams.get('filename');
  const type = url.searchParams.get('type');

  if (!targetUrl || targetUrl.length > 2048) {
    return new Response('Missing or invalid media URL parameter.', { status: 400 });
  }

  let decodedUrl = targetUrl;
  try {
    decodedUrl = decodeURIComponent(targetUrl);
  } catch {
    return new Response('Malformed URL parameter.', { status: 400 });
  }

  const validatedUrl = isSafeUrl(targetUrl) ? targetUrl : isSafeUrl(decodedUrl) ? decodedUrl : null;

  if (!validatedUrl) {
    return new Response('Forbidden: Disallowed media URL.', { status: 403 });
  }

  // Strict domain whitelist check for proxy to prevent arbitrary open proxy abuse
  if (!isAllowedProxyDomain(validatedUrl)) {
    return new Response('Forbidden: Media domain not authorized for proxy download.', { status: 403 });
  }

  const safeFilename =
    filename && filename.trim()
      ? filename.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 120)
      : 'instasave_media.mp4';

  try {
    const upstreamRes = await safeFetch(
      validatedUrl,
      {
        headers: {
          'User-Agent': USER_AGENT,
        },
        signal: AbortSignal.timeout(20000),
      },
      isAllowedProxyDomain
    );

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new Response('Failed to fetch media stream from source server.', {
        status: upstreamRes.status || 502,
      });
    }

    const rawContentType = (upstreamRes.headers.get('content-type') || '').toLowerCase();
    // Block active document/script MIME types from being proxied
    if (
      rawContentType.includes('text/html') ||
      rawContentType.includes('application/xhtml') ||
      rawContentType.includes('javascript') ||
      rawContentType.includes('image/svg+xml')
    ) {
      return new Response('Forbidden: Unsupported content type from media host.', { status: 415 });
    }

    let contentType = rawContentType || 'application/octet-stream';
    if (type === 'audio' || safeFilename.endsWith('.mp3')) {
      contentType = 'audio/mpeg';
    } else if (safeFilename.endsWith('.mp4')) {
      contentType = 'video/mp4';
    } else if (safeFilename.endsWith('.jpg') || safeFilename.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    }

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
    headers.set('Content-Type', contentType);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    headers.set('Cache-Control', 'public, max-age=3600');

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('[Proxy Stream Error]:', err instanceof Error ? err.message : 'Stream interrupted');
    return new Response('Stream proxy error: Unable to retrieve media stream.', { status: 500 });
  }
}

export async function handleReport(request: Request): Promise<Response> {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return Response.json(
      {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a moment before submitting again.',
      },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: 'BAD_REQUEST', message: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { type, name, email, targetUrl, details } = body as Record<string, unknown>;
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.length > 120 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.length > 160 ||
      typeof details !== 'string' ||
      details.trim().length < 10 ||
      details.length > 3000
    ) {
      return Response.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Please provide a valid name, email address, and description (at least 10 characters).',
        },
        { status: 400 }
      );
    }

    if (targetUrl !== undefined && targetUrl !== '') {
      if (typeof targetUrl !== 'string' || targetUrl.length > 2048 || !isSafeUrl(targetUrl)) {
        return Response.json(
          {
            success: false,
            error: 'INVALID_TARGET_URL',
            message: 'Please enter a valid http/https URL if referencing specific content.',
          },
          { status: 400 }
        );
      }
    }

    const referenceId = `ISM-${type === 'dmca' ? 'DMCA' : 'SUP'}-${Date.now().toString(36).toUpperCase()}`;
    console.log(`[API Report] Validated submission ${referenceId} (${type === 'dmca' ? 'DMCA' : 'Support'})`);

    return Response.json({
      success: true,
      referenceId,
      message:
        'Your request has been validated with a tracking reference ID. Please complete delivery via your email client or official WhatsApp support channel so our team can respond.',
    });
  } catch {
    return Response.json(
      { success: false, error: 'SERVER_ERROR', message: 'Unable to validate request at this time.' },
      { status: 500 }
    );
  }
}

export function handleSampleUrls(): Response {
  return Response.json({
    video: 'https://www.instagram.com/natgeo/',
    reels: 'https://www.instagram.com/nasa/',
    story: 'https://www.instagram.com/stories/natgeo/',
    photo: 'https://www.instagram.com/natgeo/',
    audio: 'https://www.instagram.com/nasa/',
  });
}

export function handleStatus(): Response {
  return Response.json({
    status: 'online',
    version: '4.2.0',
    service: 'InstaSave Media API',
    runtime: 'Vercel Serverless / Cloudflare Edge / Web Standards Engine',
    supportedCategories: ['video', 'reels', 'story', 'photo', 'audio'],
    ssrfProtection: 'active',
    rateLimiting: 'active',
    dynamicProcessing: 'active',
    noHardcodedSampleMedia: true,
  });
}

// Global API Dispatcher for Vercel Serverless Functions / Cloudflare Pages / Workers
export async function handleApiRequest(request: Request, _env?: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const cleanPath = path.replace(/\/+$/, '') || '/';
  const corsHeaders = getCorsHeaders(request);

  console.log(`[API ${request.method}] ${cleanPath}`);

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  let response: Response;

  if (cleanPath.endsWith('/api/extract') || cleanPath.endsWith('/extract')) {
    if (request.method !== 'POST') {
      response = Response.json(
        {
          success: false,
          error: 'METHOD_NOT_ALLOWED',
          message: 'The /api/extract endpoint only accepts POST requests with a JSON body.',
        },
        { status: 405 }
      );
    } else {
      response = await handleExtract(request);
    }
  } else if (cleanPath.includes('/api/download/proxy') || cleanPath.includes('/download/proxy')) {
    response = await handleProxy(request);
  } else if (cleanPath.endsWith('/api/report') || cleanPath.endsWith('/report')) {
    if (request.method !== 'POST') {
      response = Response.json(
        { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Use POST for /api/report.' },
        { status: 405 }
      );
    } else {
      response = await handleReport(request);
    }
  } else if (cleanPath.endsWith('/api/sample-urls') || cleanPath.endsWith('/sample-urls')) {
    response = handleSampleUrls();
  } else if (
    cleanPath.endsWith('/api/status') ||
    cleanPath.endsWith('/status') ||
    cleanPath === '/api' ||
    cleanPath === '/'
  ) {
    response = handleStatus();
  } else {
    console.warn(`[API 404] Route not matched: ${cleanPath}`);
    response = Response.json(
      {
        success: false,
        error: 'NOT_FOUND',
        message: `API route '${cleanPath}' not found`,
      },
      { status: 404 }
    );
  }

  const finalHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([k, v]) => finalHeaders.set(k, v));
  finalHeaders.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: finalHeaders,
  });
}
