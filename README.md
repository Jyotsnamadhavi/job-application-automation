# Job Automation AI

An AI-powered browser extension for automated job applications using a modular multi-agent system.

## Overview

Job Automation AI streamlines the job application process by automatically detecting and filling application forms across multiple platforms. Built with modern web technologies and AI capabilities, it helps job seekers save time while maintaining accuracy and professionalism.

## Features

### Core Functionality
- **User Profile Management**: Store and manage professional information securely
- **Smart Form Detection**: Automatically identify job application forms
- **Intelligent Auto-Fill**: Fill forms with profile data using AI-powered field mapping
- **Application Tracking**: Monitor and track all job applications
- **Settings Management**: Configure extension behavior and preferences
- **Local Storage**: All data stored securely in your browser

### Supported Platforms
- Lever (jobs.lever.co)
- Greenhouse (boards.greenhouse.io)
- Workday (workday.com)
- LinkedIn Jobs (linkedin.com/jobs)

## Installation

### Prerequisites
- Google Chrome browser
- Node.js (for development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jyotsnamadhavi/job-application-automation.git
   cd job-application-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the project directory

5. **Configure your profile**
   - Click the extension icon in your browser toolbar
   - Complete your professional profile in the Profile tab
   - Save your information

## Usage

### Basic Workflow

1. **Visit a job application page** on any supported platform
2. **Activate the extension** by clicking the toolbar icon
3. **Review and submit** the auto-filled application
4. **Track your applications** through the Applications tab

### Configuration

- **Auto-fill Settings**: Enable/disable automatic form filling
- **Application Tracking**: Choose what data to track
- **Privacy Controls**: Manage data storage preferences

## Development

### Project Structure

```
├── manifest.json           # Extension configuration
├── package.json            # Dependencies and scripts
├── frontend/               # UI components
│   ├── popup.html         # Extension popup
│   ├── popup.js           # Popup functionality
│   ├── content.js         # Content script
│   └── welcome.html       # Welcome page
├── backend/               # Core logic
│   └── background.js      # Service worker
├── shared/                # Utilities
│   ├── constants.js       # Shared constants
│   └── utils.js           # Utility functions
└── test-page.html         # Development testing
```

### Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with watch
npm run dev

# Run tests
npm test

# Code quality
npm run lint
npm run format
```

### Testing

1. Load the extension in Chrome developer mode
2. Open `test-page.html` for testing
3. Use browser console for debugging

## Architecture

The extension uses a modular architecture with clear separation of concerns:

- **Frontend**: User interface and content scripts
- **Backend**: Service worker for background processing
- **Shared**: Common utilities and constants
- **AI Integration**: LangChain-based intelligent form processing

## Privacy & Security

- **Local Storage**: All data stored locally in your browser
- **No External Servers**: No data transmitted to external servers
- **User Control**: Complete control over stored data
- **Transparent**: Open source for full transparency

## Roadmap

### Phase 1: Foundation (Complete)
- Basic extension setup and core functionality
- User profile management and form auto-fill
- Application tracking and settings management

### Phase 2: AI Integration (In Progress)
- LangChain agent implementation
- Enhanced form detection and field mapping
- Improved platform support

### Phase 3: Advanced Features (Planned)
- Intelligent form filling with error handling
- Multi-input type support
- Performance optimization

### Phase 4: Advanced AI (Future)
- AI-generated cover letters
- Job scraping and matching
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the project structure for implementation details
- **Community**: Join discussions for help and collaboration

## Disclaimer

This tool is designed to assist with job applications. Always review auto-filled information before submitting applications to ensure accuracy and appropriateness for each position.

---

*Built with modern web technologies and AI capabilities to streamline the job application process.* 