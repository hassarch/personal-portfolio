# Starlight Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ Modern, animated UI with star background effects
- 📱 Fully responsive design
- 🎨 Beautiful gradient animations and glass-morphism effects
- 📧 Functional contact form with Formspree integration
- ⚡ Fast and optimized with Vite

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd starlight-portfolio
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Contact Form Setup

The contact form uses Formspree to handle form submissions. To set it up:

1. **Sign up for Formspree** (free tier available):
   - Go to https://formspree.io/
   - Create an account and verify your email

2. **Create a new form**:
   - After logging in, click "New Form"
   - Give it a name (e.g., "Portfolio Contact")
   - Copy the form endpoint URL (looks like: `https://formspree.io/f/YOUR_FORM_ID`)

3. **Configure environment variables**:
   - Add your Formspree endpoint to the `.env` file:
     ```
     VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
     ```
   - Replace `YOUR_FORM_ID` with your actual form ID

4. **Test the form**:
   - Fill out and submit the contact form
   - Check your Formspree dashboard to see the submission

**Note**: If Formspree is not configured, the form will fall back to opening your default email client with a pre-filled message.

## Build for Production

```sh
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Deployment

You can deploy this project to any static hosting service such as:

- **Vercel** - Recommended for easy deployment
- **Netlify** - Great for static sites
- **GitHub Pages** - Free hosting for GitHub repos
- **Cloudflare Pages** - Fast global CDN

Simply connect your repository and the platform will automatically build and deploy your site.

## License

This project is open source and available under the MIT License.
