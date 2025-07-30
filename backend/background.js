// Backend Background Service Worker for Job Automation AI
// Manages extension lifecycle and communication

import { StorageManager, Logger } from '../shared/utils.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../shared/constants.js';

class BackgroundService {
    constructor() {
        this.logger = new Logger('background');
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.logger.info('Background service initialized');
    }

    setupEventListeners() {
        // Extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });

        // Tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        // Extension icon click
        chrome.action.onClicked.addListener((tab) => {
            this.handleActionClick(tab);
        });

        // Message handling
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    async handleInstallation(details) {
        if (details.reason === 'install') {
            this.logger.info('Extension installed');
            
            // Set default settings
            await StorageManager.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
            
            // Open welcome page
            chrome.tabs.create({
                url: chrome.runtime.getURL('frontend/welcome.html')
            });
        } else if (details.reason === 'update') {
            this.logger.info('Extension updated');
        }
    }

    async handleTabUpdate(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url) {
            if (this.isJobApplicationPage(tab.url)) {
                this.logger.info('Job application page detected', { url: tab.url });
                
                // Inject content script
                await this.injectContentScript(tabId);
            }
        }
    }

    async handleActionClick(tab) {
        this.logger.info('Extension icon clicked', { url: tab.url });
        
        if (this.isJobApplicationPage(tab.url)) {
            // Trigger auto-fill on the current page
            try {
                const response = await chrome.tabs.sendMessage(tab.id, { action: 'autoFill' });
                this.logger.info('Auto-fill triggered via icon click', { response });
            } catch (error) {
                this.logger.error('Failed to trigger auto-fill', { error: error.message });
                // Try to inject content script and retry
                try {
                    await this.injectContentScript(tab.id);
                    setTimeout(async () => {
                        try {
                            await chrome.tabs.sendMessage(tab.id, { action: 'autoFill' });
                        } catch (retryError) {
                            this.logger.error('Retry failed', { error: retryError.message });
                        }
                    }, 1000);
                } catch (injectError) {
                    this.logger.error('Failed to inject content script', { error: injectError.message });
                }
            }
        } else {
            // Open popup for non-job pages
            chrome.action.setPopup({ popup: 'frontend/popup.html' });
        }
    }

    async handleMessage(request, sender, sendResponse) {
        this.logger.info('Message received', { action: request.action, sender: sender.tab?.url });
        
        try {
            switch (request.action) {
                case 'getTabInfo':
                    const tabInfo = await this.getTabInfo(sender.tab.id);
                    sendResponse({ success: true, data: tabInfo });
                    break;

                case 'logApplication':
                    await this.logApplication(request.data);
                    sendResponse({ success: true });
                    break;

                case 'getSettings':
                    const settings = await this.getSettings();
                    sendResponse({ success: true, data: settings });
                    break;

                case 'updateSettings':
                    await this.updateSettings(request.data);
                    sendResponse({ success: true });
                    break;

                case 'getLogs':
                    const logs = await StorageManager.loadLocal(STORAGE_KEYS.LOGS, []);
                    sendResponse({ success: true, data: logs });
                    break;

                case 'clearLogs':
                    await StorageManager.saveLocal(STORAGE_KEYS.LOGS, []);
                    sendResponse({ success: true });
                    break;

                case 'autoFill':
                    // Forward auto-fill request to content script
                    if (sender.tab) {
                        try {
                            const response = await chrome.tabs.sendMessage(sender.tab.id, { action: 'autoFill' });
                            sendResponse({ success: true, data: response });
                        } catch (error) {
                            this.logger.error('Failed to forward auto-fill request', { error: error.message });
                            sendResponse({ success: false, error: error.message });
                        }
                    } else {
                        sendResponse({ success: false, error: 'No tab context' });
                    }
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            this.logger.error('Error handling message', { error: error.message, action: request.action });
            sendResponse({ success: false, error: error.message });
        }
    }

    isJobApplicationPage(url) {
        const jobSites = [
            'jobs.lever.co',
            'boards.greenhouse.io',
            'workday.com',
            'linkedin.com/jobs'
        ];
        
        return jobSites.some(site => url.includes(site));
    }

    async injectContentScript(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['frontend/content.js']
            });
            this.logger.info('Content script injected', { tabId });
        } catch (error) {
            this.logger.error('Failed to inject content script', { error: error.message, tabId });
        }
    }

    async getTabInfo(tabId) {
        try {
            const tab = await chrome.tabs.get(tabId);
            return {
                id: tab.id,
                url: tab.url,
                title: tab.title,
                isJobPage: this.isJobApplicationPage(tab.url)
            };
        } catch (error) {
            this.logger.error('Error getting tab info', { error: error.message });
            return null;
        }
    }

    async logApplication(applicationData) {
        try {
            const applications = await StorageManager.loadLocal(STORAGE_KEYS.APPLICATIONS, []);
            applications.push({
                ...applicationData,
                id: this.generateId(),
                timestamp: new Date().toISOString()
            });
            
            await StorageManager.saveLocal(STORAGE_KEYS.APPLICATIONS, applications);
            this.logger.info('Application logged', applicationData);
        } catch (error) {
            this.logger.error('Error logging application', { error: error.message });
        }
    }

    async getSettings() {
        try {
            return await StorageManager.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        } catch (error) {
            this.logger.error('Error getting settings', { error: error.message });
            return DEFAULT_SETTINGS;
        }
    }

    async updateSettings(newSettings) {
        try {
            const currentSettings = await this.getSettings();
            const updatedSettings = { ...currentSettings, ...newSettings };
            await StorageManager.save(STORAGE_KEYS.SETTINGS, updatedSettings);
            this.logger.info('Settings updated', updatedSettings);
        } catch (error) {
            this.logger.error('Error updating settings', { error: error.message });
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize background service
new BackgroundService(); 