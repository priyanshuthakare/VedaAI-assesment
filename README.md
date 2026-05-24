# VedaAI Assessment Creator

Welcome to the **VedaAI Full Stack Engineering Assignment** repository. This project is a complete, production-ready AI Assessment Creator built to match the provided Figma specifications.

## Overview

The VedaAI Assessment Creator allows educators to dynamically generate highly structured question papers using AI. It features a modern, responsive UI, real-time generation status updates, and a robust background job processing architecture.

### Key Highlights
- **Pixel-Perfect UI:** Strictly adheres to the provided Figma design using custom typography (Bricolage Grotesque & Inter) and Tailwind CSS.
- **Asynchronous AI Generation:** Utilizes Redis and BullMQ to handle heavy LLM processing in the background without blocking the main thread.
- **Real-Time Updates:** WebSockets push live status updates to the client during the generation process.
- **High-Signal Bonus Features:** 
  - Backend PDF generation using Headless Chrome (Puppeteer).
  - Visual difficulty badges (Easy, Moderate, Hard).
  - Voice-to-text assignment instructions via the Web Speech API.

## Documentation

For a detailed breakdown of how this project works, please refer to the documentation in the `/docs` directory:

1. [**Architecture Overview**](./docs/ARCHITECTURE.md) - Learn how Next.js, Express, BullMQ, WebSockets, and Gemini AI communicate.
2. [**Setup & Deployment**](./docs/SETUP.md) - Instructions for running the project locally and deploying it to the cloud.
3. [**Features & Requirements**](./docs/FEATURES.md) - A checklist of how the project meets and exceeds the assignment requirements.

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Real-time:** Native WebSockets

### Backend
- **Framework:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Queue/Caching:** Redis (Upstash) + BullMQ
- **AI Integration:** Google Gemini (Generative AI SDK)
- **PDF Generation:** Puppeteer (Headless Chrome)

---
*Developed for the VedaAI Full Stack Engineering Assignment.*
