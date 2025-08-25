# ReadVerse - Digital Library Platform

A modern digital library platform built with React and Bootstrap, featuring a beautiful blue-themed interface.

## Features

- 📚 **Story Management**: Browse and read stories from various genres
- 🎨 **Modern UI**: Beautiful blue-themed interface with smooth animations
- 🔍 **Search & Filter**: Find stories by title, author, or genre
- 👤 **User Authentication**: Login, signup, and user profile management
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌐 **API Integration**: Uses JSON Server for data management

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Styling**: Custom CSS with blue theme
- **Data**: JSON Server (REST API)
- **Icons**: React Icons

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd read-verse-v01
```

2. Install dependencies:
```bash
npm install
```

3. Start JSON Server (in a separate terminal):
```bash
npm run server
```

4. Start the React application:
```bash
npm start
```

The application will be available at `http://localhost:3000` and the API at `http://localhost:3001`.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common components
│   ├── Header.js       # Navigation header
│   └── Footer.js       # Footer component
├── context/            # React Context providers
├── data/               # Static data files
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── admin/          # Admin dashboard
│   ├── story/          # Story-related pages
│   ├── About.js        # About page
│   ├── Contact.js      # Contact page
│   └── PrivacyPolicy.js # Privacy policy page
├── styles/             # CSS files
├── utils/              # Utility functions
└── App.js              # Main application component
```

## Key Features

### 1. Blue Theme Design
- Modern blue color scheme throughout the interface
- Smooth hover effects and transitions
- Consistent design language across all components

### 2. Story Display
- **4 books per row** layout for optimal viewing
- Responsive grid system (lg=3, md=4, sm=6)
- Beautiful card design with hover effects

### 3. API Integration
- JSON Server backend for data management
- RESTful API endpoints for stories, users, and comments
- Async/await pattern for data fetching

### 4. Navigation
- Header with genre dropdown and user menu
- Footer with social links and important pages
- Responsive mobile navigation

### 5. New Pages
- **About**: Company information and mission
- **Contact**: Contact form and information
- **Privacy Policy**: Privacy policy and terms

## API Endpoints

- `GET /stories` - Get all stories
- `GET /stories/:id` - Get story by ID
- `PATCH /stories/:id` - Update story (e.g., view count)
- `GET /stories?genre=:genre` - Filter by genre
- `GET /stories?q=:query` - Search stories
- `GET /users` - Get all users
- `GET /comments` - Get all comments

## Customization

### Changing Colors
The blue theme can be customized by modifying the CSS variables in the style files:
- Primary blue: `#3b82f6`
- Dark blue: `#1e40af`
- Light blue: `#60a5fa`

### Layout Adjustments
- Story grid layout can be modified in `Home.js` and `StoryList.js`
- Card sizes and spacing can be adjusted in the CSS files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created by Group 2 for educational purposes.

## Support

For support or questions, please contact the development team or create an issue in the repository.
