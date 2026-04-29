---
phase: planning
title: Supabase Migration Task Breakdown
description: Break down the Supabase + Vercel migration into actionable tasks and estimate timeline
---

# Project Planning: Supabase & Vercel Migration

## Milestones

- [x] Milestone 1: Next.js Foundation & Database Schema Update
- [x] Milestone 2: Authentication & Storage implementation
- [ ] Milestone 3: Data Migration (Ads & Requests)
- [ ] Milestone 4: AI Webhook Integration & Final Testing

## Task Breakdown

### Phase 1: Foundation & Setup
- [x] Task 1.1: Verify Next.js App Router setup and folder structure.
- [x] Task 1.2: Initialize Supabase Client (`src/lib/supabase/client.ts` and `server.ts`) and configure `.env`.
- [x] Task 1.3: Update DB Schema for Geolocation (`latitude` and `longitude` fields) in migrations.

### Phase 2: Auth & Storage
- [x] Task 2.1: Supabase Auth Implementation (Magic Links) replacing mock states.
- [x] Task 2.2: Storage Integration for `public-glasses` and `private-prescriptions` buckets.

### Phase 3: Data Migration
- [ ] Task 3.1: Migrate Ads fetching and creation logic to Supabase queries.
- [ ] Task 3.2: Migrate Prescription Requests fetching and creation to Supabase queries.

### Phase 4: AI Webhook
- [ ] Task 4.1: Implement Gemini AI Moderation Webhook API route to process ads asynchronously.

## Dependencies

- **Task 1.3** must be completed before **Phase 3** (Data Migration).
- **Task 2.1** must be completed before anything else requiring an authenticated user session.
- Requires external service configurations: Supabase Project API Keys and Google Gemini API Key.
