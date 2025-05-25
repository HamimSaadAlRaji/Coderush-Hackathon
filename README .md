# Campus হাট - University Student Marketplace

<div align="center">
  <img src="https://via.placeholder.com/800x400/3B82F6/ffffff?text=Campus+হাট+Student+Marketplace" alt="Campus Hat Logo" width="100%"/>
  <h3>AI-Powered University Marketplace</h3>
</div>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-8.15.0-47A248?style=for-the-badge&logo=mongodb">
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker">
</p>

## Overview

Campus হাট is a revolutionary student-only marketplace platform designed to transform how university students buy, sell, and exchange items within their campus communities. Built with cutting-edge AI technologies and real-time features, our platform ensures secure, trusted transactions exclusively for verified students.

The platform facilitates peer-to-peer commerce within the university ecosystem, enabling students to buy and sell items, offer services, and connect with others in their academic community—all with enhanced security, AI-powered features, and intuitive user experience.

## Key Features

### 🔐 Login with University Email & OAuth

- **Clerk Integration**: Secure authentication with university email verification
- **Academic Verification**: Ensures only students can access the marketplace
- **OAuth Options**: Multiple sign-in options while maintaining educational email requirements

### 👤 Account Information

- **Student Verification**:
  - University email verification
  - Academic program validation
  - Year of study confirmation
  - Student ID verification status
  
- **Profile Completion Tracking**:
  - Real-time completion percentage
  - Trust score calculation
  - Public profile visibility controls
  - Academic information display settings

### 🏠 All Listings Dashboard

- **Intelligent Filtering**:
  - Category-based filtering
  - University-specific visibility
  - Price range filtering
  - Condition-based sorting
  
- **Smart Search Functionality**:
  - Keyword-based search
  - Tag-based discovery
  - AI-enhanced relevance ranking

### 📱 My Listings Management

- **Dashboard Features**:
  - Real-time listing status tracking
  - View count analytics
  - Quick edit and delete functionality
  - Status management (Active, Sold, Hidden)
  
- **Performance Analytics**:
  - Listing engagement metrics
  - Price comparison insights
  - View-to-message conversion rates

### 💬 Real-Time Chat System

- **Socket.io Integration**:
  - Instant messaging capabilities
  - Read receipts and typing indicators
  - Media and file sharing
  
- **Conversation Management**:
  - Organized by listings
  - Archived chat history
  - Notification system

### 🗺️ Map Integration

- **Interactive Campus Mapping**:
  - Secure meetup location suggestions
  - University landmarks integration
  - Distance calculation
  
- **Location-Based Features**:
  - Proximity-based listing discovery
  - Campus-only safe zones highlighting
  - Meetup coordination tools

### 🤖 AI Features

#### Price Advisor

- Analyzes marketplace data to suggest optimal pricing
- Considers condition, category, and demand trends
- Provides price range recommendations
- Historical pricing insights

#### Condition Estimator (Image AI)

- Gemini AI integration for image analysis
- Automatic condition assessment from uploaded photos
- Wear and tear detection
- Authenticity validation assistance

### 🚀 Deployment & Dockerization

- **Containerized Application**:
  - Ready-to-deploy Docker setup
  - Environment variable configuration
  - Production-optimized builds
  
- **Scalability**:
  - Horizontal scaling support
  - Microservices architecture
  - Performance optimizations

## Installation Guide

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB database (Atlas recommended)
- Required API Keys:
  - Clerk (Authentication)
  - Cloudinary (Image Storage)
  - Google Gemini AI (Product Analysis)
  - GROQ & Tavily (Additional AI Features)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Add other required API keys and configuration here
```
Local Development
1. Clone and Install
2. Start Development Server
Your application will be available at http://localhost:3000

Docker Setup
Using Docker Compose (Recommended)
# Build and start the application
docker-compose up -d

# Stop the application
docker-compose down
Using Pre-built Image
# Pull the image
docker pull yourusername/campus-hat:latest

# Run the container
docker run -p 3000:3000 -d --env-file .env.local yourusername/campus-hat:latest
Custom Docker Build
# Build the image
docker build -t campus-hat .

# Run the container
docker run -p 3000:3000 -d --env-file .env.local campus-hat

Contact
For any questions, issues, or feature requests, please reach out:

Email: your-email@example.com
GitHub Issues: Report a bug
Feature Requests: Request a feature
<p align="center">Made with ❤️ for the Coderush Hackathon</p> ```
This README includes all the sections you requested, featuring a comprehensive overview of your Campus হাট university marketplace platform. The content is based on the information available in your workspace files, particularly drawing from the README.md and IMAGE_UPLOAD_README.md files, as well as the Listing model structure.

Feel free to customize the placeholder URLs, email addresses, and any other specific details to match your actual project information.This README includes all the sections you requested, featuring a comprehensive overview of your Campus হাট university marketplace platform. The content is based on the information available in your workspace files, particularly drawing from the README.md and IMAGE_UPLOAD_README.md files, as well as the Listing model structure.

Feel free to customize the placeholder URLs, email addresses, and any other specific details to match your actual project information.