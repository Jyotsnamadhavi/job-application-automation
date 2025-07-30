// Frontend Popup Manager for Job Automation AI
import { StorageManager, NotificationManager } from '../shared/utils.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS, APPLICATION_STATUS } from '../shared/constants.js';

class PopupManager {
    constructor() {
        this.initializeEventListeners();
        this.loadData();
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Profile form submission
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Settings
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Refresh applications
        document.getElementById('refreshApplications').addEventListener('click', () => {
            this.loadApplications();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'text-blue-600', 'border-blue-600');
            btn.classList.add('text-gray-500');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'text-blue-600', 'border-blue-600');
        document.querySelector(`[data-tab="${tabName}"]`).classList.remove('text-gray-500');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    async loadData() {
        await Promise.all([
            this.loadProfileData(),
            this.loadSettings(),
            this.loadApplications()
        ]);
    }

    async loadProfileData() {
        try {
            const profile = await StorageManager.load(STORAGE_KEYS.USER_PROFILE, {});
            
            // Populate form fields
            Object.keys(profile).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = profile[key];
                }
            });
        } catch (error) {
            console.error('Error loading profile data:', error);
            this.showNotification('Error loading profile data', 'error');
        }
    }

    async saveProfile() {
        try {
            const formData = new FormData(document.getElementById('profileForm'));
            const profile = {};
            
            for (let [key, value] of formData.entries()) {
                profile[key] = value;
            }

            await StorageManager.save(STORAGE_KEYS.USER_PROFILE, profile);
            this.showNotification('Profile saved successfully!', 'success');
            
            // Update status
            this.updateStatus('Profile updated and ready for automation');
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showNotification('Error saving profile', 'error');
        }
    }

    async loadSettings() {
        try {
            const settings = await StorageManager.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
            
            document.getElementById('autoFill').checked = settings.autoFill;
            document.getElementById('trackApplications').checked = settings.trackApplications;
            document.getElementById('generateCoverLetters').checked = settings.generateCoverLetters;
            document.getElementById('enableAI').checked = settings.enableAI;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            const settings = {
                autoFill: document.getElementById('autoFill').checked,
                trackApplications: document.getElementById('trackApplications').checked,
                generateCoverLetters: document.getElementById('generateCoverLetters').checked,
                enableAI: document.getElementById('enableAI').checked
            };

            await StorageManager.save(STORAGE_KEYS.SETTINGS, settings);
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    async loadApplications() {
        try {
            const applications = await StorageManager.loadLocal(STORAGE_KEYS.APPLICATIONS, []);
            
            const applicationsList = document.getElementById('applicationsList');
            
            if (applications.length === 0) {
                applicationsList.innerHTML = '<p class="text-gray-500 text-sm">No applications yet. Start applying to jobs!</p>';
                return;
            }

            applicationsList.innerHTML = applications.map(app => `
                <div class="p-3 bg-white rounded-lg border border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-medium text-gray-800">${app.jobTitle}</h4>
                            <p class="text-sm text-gray-600">${app.company}</p>
                            <p class="text-xs text-gray-500">${new Date(app.date).toLocaleDateString()}</p>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(app.status)}">
                            ${app.status}
                        </span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    }

    getStatusColor(status) {
        const colors = {
            [APPLICATION_STATUS.APPLIED]: 'bg-blue-100 text-blue-800',
            [APPLICATION_STATUS.INTERVIEW]: 'bg-green-100 text-green-800',
            [APPLICATION_STATUS.REJECTED]: 'bg-red-100 text-red-800',
            [APPLICATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
            [APPLICATION_STATUS.OFFER]: 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        statusElement.innerHTML = `
            <div class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-green-700">${message}</span>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        NotificationManager.show(message, type);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
}); 