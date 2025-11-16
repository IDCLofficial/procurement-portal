# Data Fetching Architecture

This application uses Next.js 13+ App Router with Server Components for optimal performance and SEO.

## Overview

The application follows a **Server-First** data fetching pattern:
- Data is fetched on the server during build time (Static Generation) or request time (Server-Side Rendering)
- Client components receive data as props from server components
- Client-side filtering and interactions happen without additional API calls

## Data Fetching Functions

All data fetching logic is centralized in `/lib/contractors.ts`:

### `getContractors()`
Fetches all contractors from the API (or mock data).
- **Used in**: `/app/directory/page.tsx`
- **Pattern**: Server Component with SSR
- **Revalidation**: Can be configured with `next: { revalidate: 3600 }` for ISR

### `getContractorById(id: string)`
Fetches a single contractor by ID.
- **Used in**: `/app/contractor/[id]/page.tsx`
- **Pattern**: Static Generation with `generateStaticParams()`
- **Fallback**: Returns `null` if contractor not found

### `getAllContractorIds()`
Returns all contractor IDs for static generation.
- **Used in**: `generateStaticParams()` in `/app/contractor/[id]/page.tsx`
- **Purpose**: Pre-render all contractor detail pages at build time

## Page Patterns

### Directory Page (`/app/directory/page.tsx`)
```typescript
export default async function DirectoryPage() {
    const contractors = await getContractors(); // Server-side fetch
    return <DirectoryClient initialContractors={contractors} />; // Pass to client
}
```

**Benefits**:
- Data fetched once on the server
- No loading states needed
- Better SEO (content available in initial HTML)
- Client component handles filtering/search without API calls

### Contractor Detail Page (`/app/contractor/[id]/page.tsx`)
```typescript
// Static generation at build time
export async function generateStaticParams() {
    const ids = await getAllContractorIds();
    return ids.map((id) => ({ id }));
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const contractor = await getContractorById(params.id);
    return { title: contractor.name, ... };
}

// Server component
export default async function ContractorPage({ params }) {
    const contractor = await getContractorById(params.id);
    return <ContractorDetails contractor={contractor} />;
}
```

**Benefits**:
- All pages pre-rendered at build time (Static Generation)
- Instant page loads
- Perfect SEO
- Dynamic metadata per contractor

## Client-Side Filtering

The `DirectoryClient` component receives all contractors as props and performs filtering client-side:
- No additional API calls needed
- Instant search results
- URL-based state management (search params)
- Shareable filtered URLs

## Migration to Real API

To connect to a real API, update `/lib/contractors.ts`:

```typescript
export async function getContractors(): Promise<Contractor[]> {
    const response = await fetch('https://api.example.com/contractors', {
        next: { revalidate: 3600 } // Revalidate every hour (ISR)
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch contractors');
    }
    
    return response.json();
}

export async function getContractorById(id: string): Promise<ContractorDetail | null> {
    const response = await fetch(`https://api.example.com/contractors/${id}`, {
        next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
        return null;
    }
    
    return response.json();
}
```

## Caching Strategies

### Static Generation (SSG)
- **Best for**: Contractor detail pages
- **When**: Content doesn't change frequently
- **How**: `generateStaticParams()` + async Server Component

### Incremental Static Regeneration (ISR)
- **Best for**: Directory listing
- **When**: Content updates periodically
- **How**: Add `next: { revalidate: 3600 }` to fetch options

### Server-Side Rendering (SSR)
- **Best for**: Personalized content
- **When**: Content must be fresh on every request
- **How**: Async Server Component without revalidate

## Performance Benefits

1. **Zero Client-Side API Calls**: All data fetched on server
2. **Instant Filtering**: Client-side filtering of server data
3. **SEO Optimized**: Full HTML content in initial response
4. **Build-Time Generation**: Contractor pages pre-rendered
5. **Efficient Caching**: ISR keeps data fresh without rebuilding

## Environment Variables

For production API integration, add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.imostate.gov.ng
API_SECRET_KEY=your-secret-key
```

Then update fetch calls:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contractors`, {
    headers: {
        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
    }
});
```
