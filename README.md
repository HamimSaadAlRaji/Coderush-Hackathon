🏫 Campus হাট (Campus Hat)
A Next.js Student-Only Marketplace with AI-Powered Features and Real-Time Communication

By Team Coderush - Student Trading Revolution

<img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&amp;logo=next.js">
<img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&amp;logo=react">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&amp;logo=typescript">
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-8.15.0-47A248?style=for-the-badge&amp;logo=mongodb">
<img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&amp;logo=tailwindcss">
<img alt="Docker" src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&amp;logo=docker">
<div align="center"> <img src="https://via.placeholder.com/800x400/3B82F6/ffffff?text=Campus+হাট+Student+Marketplace" alt="Campus Hat Logo" width="100%"/> </div>
🎯 AI-Powered Student Marketplace Platform
Live Demo · Report Bug · Request Feature

<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/username/Coderush-Hackathon">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/username/Coderush-Hackathon">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/username/Coderush-Hackathon">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/username/Coderush-Hackathon">
<img alt="License" src="https://img.shields.io/github/license/username/Coderush-Hackathon">
🌟 Overview
Campus হাট is a revolutionary student-only marketplace platform that transforms how university students buy, sell, and exchange items within their campus communities. Built with cutting-edge AI technologies and real-time features, our platform ensures secure, trusted transactions exclusively for verified students.

🏆 Key Differentiators
🎓 Student-Only Access - Clerk-powered authentication with academic verification
🤖 AI-Powered Analysis - Gemini AI for product condition assessment and pricing
💬 Real-Time Chat - Socket.io integration for instant communication
📍 Campus Mapping - Interactive location-based meetup planning
🔒 Trust & Safety - University-verified profiles and rating system
✨ Core Features
🏠 Dashboard (/all-listings)
<div align="center"> <img src="https://via.placeholder.com/600x300/EBF8FF/3B82F6?text=All+Listings+Dashboard" alt="Dashboard"/> </div>
Smart Marketplace Discovery

Advanced Filtering System:
Category-based browsing (Electronics, Books, Furniture, etc.)
University-specific filtering
Price range and condition filters
Real-time search with auto-suggestions
Statistics Overview:
Total listings count
Average pricing data
Category breakdown analytics
University-wise distribution
Responsive Grid Layout:
Card-based product display
Infinite scroll pagination
Mobile-optimized interface
🛍️ Create Listings (/create-listings)
<div align="center"> <img src="https://via.placeholder.com/600x300/F0FDF4/16A34A?text=AI-Powered+Listing+Creation" alt="Create Listing"/> </div>
Multi-Step Listing Creation with AI Integration

Step 1 - Category Selection:
Smart category detection
Subcategory auto-suggestion
Image-based category prediction
Step 2 - AI Analysis:
Gemini AI Integration for automatic product analysis
Condition assessment (New, Like New, Good, Fair, Poor)
Suggested pricing based on market data
Auto-generated descriptions
Step 3 - Image Upload:
Cloudinary Integration with drag-and-drop
Multiple image support (up to 10 images)
Auto-compression and optimization
Real-time preview and editing
Step 4 - Location & Visibility:
Interactive campus map integration
Meeting point suggestions
University-only or public visibility options
💬 Real-Time Communication (/chat)
<div align="center"> <img src="https://via.placeholder.com/600x300/FEF3C7/D97706?text=Real-Time+Chat+System" alt="Chat System"/> </div>
Socket.io-Powered Messaging System

Features:
Real-time message delivery
Image sharing capabilities
Conversation history
Message status indicators (sent, delivered, read)
Typing indicators
Chat Management:
Conversation sidebar with recent chats
Search through message history
Seller-buyer connection automation
Message encryption for privacy
👤 User Profiles (/account)
<div align="center"> <img src="https://via.placeholder.com/600x300/F3E8FF/9333EA?text=Student+Profile+System" alt="Profile Management"/> </div>
Academic-Verified Profile System

Student Verification:
University email verification
Academic program validation
Year of study confirmation
Student ID verification status
Profile Completion Tracking:
Real-time completion percentage
Trust score calculation
Public profile visibility controls
Academic information display settings
📱 My Listings (/my-listings)
<div align="center"> <img src="https://via.placeholder.com/600x300/ECFDF5/059669?text=Listing+Management+Dashboard" alt="My Listings"/> </div>
Comprehensive Listing Management

Dashboard Features:
Real-time listing status tracking
View count analytics
Quick edit and delete functionality
Status management (Active, Sold, Hidden)
Performance Analytics:
Listing engagement metrics
Price comparison insights
View-to-message conversion rates
🔍 Advanced Product Pages (/product/[id])
<div align="center"> <img src="https://via.placeholder.com/600x300/FEF2F2/DC2626?text=Detailed+Product+View" alt="Product Page"/> </div>
Detailed Product Information

Interactive Image Gallery:
Full-screen image viewer
Zoom functionality
Multiple angle views
Seller Information:
Verified student status
University and program details
Rating and review system
Response time indicators
Action Buttons:
Direct message seller
Save to favorites
Share listing
Report inappropriate content
🚀 Installation & Setup
Prerequisites
Node.js 18+ and npm 9+
MongoDB database (Atlas recommended)
Required API Keys:
Clerk (Authentication)
Cloudinary (Image Storage)
Google Gemini AI (Product Analysis)
GROQ & Tavily (Additional AI Features)
🖥️ Local Development
Clone and Install
Environment Setup
Required Environment Variables:

Start Development Server
🐳 Docker Setup
Using Docker Compose (Recommended)
Using Pre-built Image
Custom Docker Build
🔧 Additional Scripts
🛠️ Tech Stack
Frontend Architecture
Technology	Version	Purpose
Next.js	15.3.2	React framework with App Router
React	19.0.0	Component-based UI library
TypeScript	5+	Type-safe development
TailwindCSS	4+	Utility-first CSS framework
Framer Motion	12+	Animation and transitions
HeroUI	2.7.8	Modern component library
Backend & Infrastructure
Technology	Version	Purpose
Node.js	18+	JavaScript runtime
MongoDB	8.15.0	Document database with Mongoose
Clerk	6.20.0	Authentication & user management
Cloudinary	2.6.1	Image storage & optimization
Socket.io	4.8.1	Real-time communication
AI/ML Integration
Service	Purpose
Google Gemini AI	Product analysis & condition assessment
GROQ SDK	Fast AI processing
Tavily API	Enhanced search capabilities
Development & Deployment
Tool	Purpose
Docker	Containerization & deployment
ESLint	Code quality & consistency
Git	Version control
📊 Database Schema
User Collection
Listing Collection
Message/Conversation Collections
🔒 Security Features
Authentication & Authorization
Clerk Integration: Secure OAuth with university email verification
Route Protection: Middleware-based authentication for all protected routes
Role-Based Access: Student verification and admin controls
Data Security
Input Validation: Comprehensive validation for all API endpoints
File Upload Security: Cloudinary integration with type and size restrictions
Database Security: MongoDB Atlas with encryption at rest
Privacy Controls
University-Only Visibility: Restrict listings to university community
Profile Privacy: Granular control over profile information display
Message Encryption: Secure real-time communication
🧪 Testing & Quality
API Testing
Feature Testing
User Registration: Sign up with university email
Listing Creation: Complete multi-step form with AI analysis
Image Upload: Test drag-and-drop with multiple formats
Real-time Chat: Message functionality between users
Search & Filter: Advanced filtering and search capabilities
📈 Performance Optimization
Frontend Optimizations
Image Optimization: Next.js Image component with Cloudinary
Code Splitting: Automatic route-based code splitting
Lazy Loading: Skeleton loading states and progressive enhancement
Caching: Optimized API calls with SWR patterns
Backend Optimizations
Database Indexing: Optimized MongoDB indexes for search and filtering
Image Compression: Automatic Cloudinary optimization
API Rate Limiting: Prevents abuse and ensures fair usage
Efficient Pagination: Cursor-based pagination for large datasets
🚢 Deployment Options
Docker Deployment (Recommended)
Vercel Deployment
Custom Server Deployment
🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Development Workflow
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📬 Contact & Support
Project Repository: GitHub - Coderush Hackathon
Documentation: Campus হাট Docs
Support Email: support@campushat.com
Team: Coderush Development Team
🙏 Acknowledgments
Google Gemini AI for intelligent product analysis
Clerk for robust authentication infrastructure
Cloudinary for reliable image management
MongoDB Atlas for scalable database solutions
Next.js Team for the amazing framework
Open Source Community for incredible tools and libraries
<div align="center"> <h3>🎓 Built for Students, By Students 🎓</h3> <p><em>Transforming campus commerce through technology</em></p>
⭐ Star this repository if you found it helpful!

</div>