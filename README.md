# 🎯 Job Automation AI

An AI-powered browser extension for automated job applications using a modular multi-agent system.

## 🚀 Features

### Phase 1: Foundation & Basic Extension ✅
- **User Profile Management**: Store and manage your professional information
- **Basic Form Detection**: Automatically detect job application forms
- **Smart Auto-Fill**: Fill forms with your profile data
- **Application Tracking**: Track all your job applications
- **Settings Management**: Configure extension behavior
- **Local Storage**: All data stored securely in your browser

### Phase 2: Form Detection Agent 🧭 (Coming Soon)
- **LangChain Integration**: AI-powered field mapping
- **Semantic Understanding**: Understand form fields contextually
- **Multi-Platform Support**: Enhanced support for Lever, Greenhouse, Workday, LinkedIn

### Phase 3: Filling Agent ✍️ (Coming Soon)
- **Intelligent Filling**: AI decides what data to enter
- **Multi-Input Support**: Handle radio buttons, checkboxes, dropdowns
- **Error Handling**: Robust error recovery

### Phase 4: Advanced Features 🔮 (Future)
- **Cover Letter Generation**: AI-generated custom cover letters
- **Job Scraping**: Automatically find and apply to relevant jobs
- **Analytics Dashboard**: Visual application progress tracking

## 🏗️ Architecture

```
job-automation-ai/
├── frontend/                 # Extension UI components
│   ├── popup.html           # Main extension popup
│   ├── popup.js             # Popup logic
│   ├── content.js           # Content script for job sites
│   └── welcome.html         # Welcome page
├── backend/                 # Extension logic
│   ├── background.js        # Service worker
│   ├── agents/              # AI agents (Phase 2+)
│   ├── services/            # Business logic
│   └── models/              # Data models
├── shared/                  # Shared utilities
│   ├── constants.js         # Shared constants
│   └── utils.js             # Utility functions
└── test-page.html           # Development test page
```

## 🛠️ Installation

### Prerequisites
- Google Chrome browser
- Node.js (for development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-automation-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `job-automation-ai` folder

4. **Set up your profile**
   - Click the extension icon in your browser toolbar
   - Fill in your professional information in the Profile tab
   - Save your profile

5. **Configure settings**
   - Go to the Settings tab
   - Enable "Auto-fill forms on job sites"
   - Enable "Track application history"

## 🎯 Usage

### Basic Usage

1. **Visit a job application page** on supported platforms:
   - Lever (jobs.lever.co)
   - Greenhouse (boards.greenhouse.io)
   - Workday (workday.com)
   - LinkedIn Jobs (linkedin.com/jobs)

2. **Auto-fill the form**:
   - Click the extension icon in your browser toolbar
   - The extension will automatically detect and fill the form
   - Review and submit the application

3. **Track your applications**:
   - View all applications in the Applications tab
   - Monitor application status and progress

### Supported Job Sites

| Platform | URL | Status |
|----------|-----|--------|
| Lever | jobs.lever.co | ✅ Supported |
| Greenhouse | boards.greenhouse.io | ✅ Supported |
| Workday | workday.com | ✅ Supported |
| LinkedIn | linkedin.com/jobs | ✅ Supported |

## 🔧 Development

### Project Structure

```
├── manifest.json           # Extension manifest
├── package.json            # Dependencies and scripts
├── frontend/               # Frontend components
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup functionality
│   ├── content.js         # Content script
│   └── welcome.html       # Welcome page
├── backend/               # Backend logic
│   └── background.js      # Service worker
├── shared/                # Shared utilities
│   ├── constants.js       # Constants and enums
│   └── utils.js           # Utility functions
└── test-page.html         # Development test page
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

# Lint code
npm run lint

# Format code
npm run format
```

### Testing

1. **Load the extension** in Chrome developer mode
2. **Open test-page.html** in your browser
3. **Test auto-fill functionality** using the test controls
4. **Check browser console** for logs and debugging info

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No External Servers**: No data is sent to external servers (Phase 1)
- **User Control**: You control what data is stored and used
- **Transparent**: Open source code for full transparency

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Basic extension setup
- [x] User profile management
- [x] Form detection and auto-fill
- [x] Application tracking
- [x] Settings management

### Phase 2: AI Integration 🧭
- [ ] LangChain agent setup
- [ ] Form detection agent
- [ ] Semantic field mapping
- [ ] Enhanced platform support

### Phase 3: Advanced Features ✍️
- [ ] Intelligent filling agent
- [ ] Multi-input type support
- [ ] Error handling and recovery
- [ ] Performance optimization

### Phase 4: Advanced AI 🔮
- [ ] Cover letter generation
- [ ] Job scraping and matching
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the [docs](docs/) folder for detailed guides
- **Community**: Join our discussions for help and ideas

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for efficient job application processes
- Thanks to the open-source community for tools and libraries

---

**Note**: This is a development project. Use responsibly and always review auto-filled information before submitting job applications. 