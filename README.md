# NASA Media Explorer

An interactive web application that allows users to explore NASA's vast media library of images, videos, and audio files. This project uses NASA's official Image and Video Library API to provide access to NASA's media content.

## Features

- **Beautiful Landing Page**: Animated introduction showcasing NASA's imagery
- **Media Search**: Search NASA's media library by keyword with filtering options
- **Media Types**: Browse images, videos, and audio files from NASA's archives
- **Detailed View**: View detailed information about each media item including descriptions and metadata
- **Responsive Design**: Fully responsive design works on desktop and mobile devices
- **Audio & Video Playback**: Integrated media players for audio and video content

## Demo

[Live Demo](https://aminesmaeili79.github.io/NASA-Project/)

## Technologies Used

- React 19
- React Router DOM 7
- GSAP (GreenSock Animation Platform)
- Axios for API requests
- Tailwind CSS for styling
- Vite for build tooling
- Claude.ai for populating data and typing long codes and this readme :) (detailed prompts given and troubleshot the mistakes)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NASA-Project.git
   cd NASA-Project
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your NASA API key:
   ```
   VITE_NASA_API_KEY=your_api_key_here
   ```
   *Note: You can get a free API key from [NASA's API portal](https://api.nasa.gov/).*

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173/NASA-Project/`

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

### Deploying to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
# or
yarn deploy
```

## How the Application Works

### Architecture

The application follows a modern React architecture with the following structure:

- **Components**: Reusable UI components
  - **Common**: Shared components like Button, Card, Input
  - **Features**: Feature-specific components
  - **Layouts**: Layout components like Navbar and Footer
- **Pages**: Main page components
- **Contexts**: React contexts for state management
- **Services**: API services and business logic
- **Hooks**: Custom React hooks
- **Assets**: Images and other static assets

### Key Workflows

#### Landing Page Animation

1. The landing page features an animated introduction using GSAP
2. The animation sequence loads NASA imagery in a grid layout
3. Page elements are revealed through carefully timed animations
4. The animation plays only once per session, with state saved in context

#### Search Functionality

1. Users enter search terms in the search input
2. They can filter by media type (image, video, audio)
3. The application sends a request to NASA's API
4. Results are displayed in a responsive grid
5. Pagination allows browsing through multiple pages of results

#### Media Viewing

1. Clicking on a search result navigates to the detailed view
2. The application fetches detailed information about the selected item
3. Media is displayed with appropriate players based on the media type:
   - Images are displayed in high resolution
   - Videos are played through a video player
   - Audio files are played through a custom audio player
4. Additional information such as description, date, and keywords is displayed

### NASA API Integration

The application integrates with NASA's Image and Video Library API to fetch media content:

- `/search` endpoint for searching media
- `/asset/{nasa_id}` for fetching detailed information about specific media
- `/asset/{nasa_id}/metadata` for fetching metadata about specific media

The API service includes retry logic and error handling to ensure a smooth user experience.

## Troubleshooting

### Common Issues

- **API Key Issues**: Make sure your NASA API key is correctly set in the `.env` file and that you have not exceeded API rate limits
- **Media Playback**: Some browsers may have issues with certain media formats. Try using Chrome or Firefox for best compatibility
- **Blank Search Results**: Ensure you're connected to the internet and that your search terms are valid

### Browser Compatibility

The application is tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For best experience, use a modern browser with up-to-date JavaScript support.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [NASA Image and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
- All images and media content are courtesy of NASA
- GSAP for the animation library
- Tailwind CSS for styling
