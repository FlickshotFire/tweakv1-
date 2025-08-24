# Overview

This is a 3D drawing and animation studio application built with React, Three.js, and Express. The application provides a comprehensive digital art platform where users can create 3D drawings with advanced brush tools, layer management, animation capabilities, and various export options. It features a modern web-based interface with real-time 3D rendering, making it suitable for digital artists and creators who want to work in three-dimensional space.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript and leverages several key technologies:

- **3D Rendering**: Uses `@react-three/fiber` and `@react-three/drei` for Three.js integration, providing hardware-accelerated 3D graphics rendering
- **UI Framework**: Implements Radix UI components with Tailwind CSS for a modern, accessible interface
- **State Management**: Utilizes Zustand stores for managing drawing state, layers, animation frames, and user preferences
- **Build System**: Vite for fast development and optimized production builds with support for GLSL shaders

The architecture follows a component-based design with specialized drawing components (`DrawingPlane`, `StrokeRenderer`, `Brush`) that handle 3D drawing operations, while UI components manage toolbars, panels, and user interactions.

## Backend Architecture
The server-side uses a lightweight Express.js setup with TypeScript:

- **Web Server**: Express.js application with middleware for JSON parsing, request logging, and error handling
- **Development Integration**: Vite middleware integration for hot module replacement during development
- **Storage Interface**: Abstracted storage layer using an interface pattern, currently implemented with in-memory storage but designed to support database integration

The backend is intentionally minimal, serving as an API foundation that can be expanded with authentication, file storage, and database operations as needed.

## Drawing Engine Architecture
The application implements a sophisticated drawing system with multiple specialized engines:

- **BrushEngine**: Handles stroke creation, point smoothing, and pressure sensitivity for natural drawing experiences
- **AnimationEngine**: Manages frame creation, duplication, and interpolation for animation workflows
- **LayerManager**: Provides layer organization, visibility control, and opacity management
- **ExportManager**: Handles multiple export formats including PNG, SVG, GIF, MP4, and JSON

This modular approach allows for easy extension and customization of drawing behaviors while maintaining clean separation of concerns.

## Data Storage Strategy
The application uses a hybrid approach for data persistence:

- **Database Schema**: Drizzle ORM with PostgreSQL support for user management and project storage
- **In-Memory Storage**: Temporary storage implementation for development and testing
- **Local Storage**: Browser-based persistence for user preferences and temporary drawing data

The storage architecture is designed to be database-agnostic, allowing for easy migration from development to production environments.

# External Dependencies

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for schema definition and migrations
- **PostgreSQL**: Primary database choice (configurable via DATABASE_URL)
- **Neon Database**: Serverless PostgreSQL integration for cloud deployment

## 3D Graphics and WebGL
- **Three.js**: Core 3D graphics library via React Three Fiber
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Collection of useful helpers and components for React Three Fiber
- **@react-three/postprocessing**: Post-processing effects for enhanced visual quality

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Lucide React**: Icon library providing consistent iconography
- **Class Variance Authority**: Utility for managing CSS class variants

## Development and Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized production builds
- **TypeScript**: Static type checking for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for server-side code
- **GLSL Plugin**: Support for GLSL shaders in the build process

## State Management and Data Fetching
- **Zustand**: Lightweight state management solution
- **TanStack React Query**: Server state management and caching
- **Zod**: Schema validation for type-safe data handling

## Additional Integrations
- **Date-fns**: Date manipulation and formatting utilities
- **Nanoid**: URL-safe unique ID generation
- **CMDK**: Command palette implementation for keyboard shortcuts