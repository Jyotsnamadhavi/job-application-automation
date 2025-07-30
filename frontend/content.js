// Frontend Content Script for Job Automation AI - Phase 1
// Handles form detection and basic auto-filling

import { 
    StorageManager, 
    Logger, 
    SiteDetector, 
    FormFieldUtils, 
    NotificationManager,
    IdGenerator 
} from '../shared/utils.js';
import { 
    STORAGE_KEYS, 
    DEFAULT_SETTINGS, 
    APPLICATION_STATUS,
    FORM_SELECTORS 
} from '../shared/constants.js';

class ContentScript {
    constructor() {
        this.userProfile = {};
        this.settings = {};
        this.currentSite = SiteDetector.detectSite(window.location.href);
        this.logger = new Logger('content-script');
        
        this.initialize();
    }

    async initialize() {
        this.logger.info('Content script starting initialization...');
        await this.loadUserData();
        this.setupMessageListener();
        this.detectJobApplicationForm();
        
        this.logger.info('Content script initialized', { 
            site: this.currentSite,
            profileKeys: Object.keys(this.userProfile),
            settings: this.settings
        });
    }

    async loadUserData() {
        try {
            this.logger.info('Loading user data...');
            const [profileResult, settingsResult] = await Promise.all([
                StorageManager.load(STORAGE_KEYS.USER_PROFILE),
                StorageManager.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
            ]);
            
            this.userProfile = profileResult || {};
            this.settings = settingsResult;
            
            this.logger.info('User data loaded', { 
                profileCount: Object.keys(this.userProfile).length,
                settings: this.settings
            });
        } catch (error) {
            this.logger.error('Error loading user data', { error: error.message });
        }
    }

    setupMessageListener() {
        this.logger.info('Setting up message listener...');
        
        // Chrome runtime message listener
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.logger.info('Message received', { action: request.action });
            
            switch (request.action) {
                case 'detectForm':
                    const formInfo = this.detectJobApplicationForm();
                    sendResponse({ success: true, formInfo });
                    break;
                    
                case 'autoFill':
                    this.autoFillForm();
                    sendResponse({ success: true });
                    break;
                    
                case 'getFormFields':
                    const fields = this.getFormFields();
                    sendResponse({ success: true, fields });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        });
        
        // Custom event listeners for test page communication
        console.log('🟡 [CONTENT SCRIPT] Setting up custom event listeners...');
        
        document.addEventListener('triggerExtensionAutoFill', (event) => {
            console.log('🟡 [CONTENT SCRIPT] Custom event: triggerExtensionAutoFill received', event.detail);
            this.logger.info('Custom event: triggerExtensionAutoFill', event.detail);
            
            try {
                this.autoFillForm();
                console.log('🟡 [CONTENT SCRIPT] Auto-fill completed successfully');
                
                // Send response back to test page
                const responseEvent = new CustomEvent('extensionResponse', {
                    detail: { 
                        success: true, 
                        message: 'Auto-fill triggered successfully',
                        action: 'autoFill'
                    }
                });
                console.log('🟡 [CONTENT SCRIPT] Dispatching response event:', responseEvent);
                document.dispatchEvent(responseEvent);
                console.log('🟡 [CONTENT SCRIPT] Response event dispatched');
                
            } catch (error) {
                console.error('🟡 [CONTENT SCRIPT] Error in auto-fill:', error);
                this.logger.error('Error in auto-fill', { error: error.message });
                
                document.dispatchEvent(new CustomEvent('extensionResponse', {
                    detail: { 
                        success: false, 
                        message: 'Error during auto-fill',
                        action: 'autoFill',
                        error: error.message
                    }
                }));
            }
        });
        
        document.addEventListener('checkExtensionStatus', async (event) => {
            console.log('🟡 [CONTENT SCRIPT] Custom event: checkExtensionStatus received', event.detail);
            this.logger.info('Custom event: checkExtensionStatus', event.detail);
            
            try {
                const settings = await StorageManager.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
                console.log('🟡 [CONTENT SCRIPT] Settings loaded:', settings);
                
                // Send response back to test page
                const responseEvent = new CustomEvent('extensionResponse', {
                    detail: { 
                        success: true, 
                        message: 'Extension is loaded and responding',
                        action: 'getSettings',
                        data: settings
                    }
                });
                console.log('🟡 [CONTENT SCRIPT] Dispatching response event:', responseEvent);
                document.dispatchEvent(responseEvent);
                console.log('🟡 [CONTENT SCRIPT] Response event dispatched');
                
                // Update status elements on test page
                const statusElement = document.getElementById('extensionStatus');
                const settingsElement = document.getElementById('settingsStatus');
                if (statusElement) {
                    statusElement.textContent = 'Loaded';
                    console.log('🟡 [CONTENT SCRIPT] Updated extensionStatus element');
                }
                if (settingsElement) {
                    settingsElement.textContent = JSON.stringify(settings);
                    console.log('🟡 [CONTENT SCRIPT] Updated settingsStatus element');
                }
                
            } catch (error) {
                console.error('🟡 [CONTENT SCRIPT] Error checking extension status:', error);
                this.logger.error('Error checking extension status', { error: error.message });
                
                document.dispatchEvent(new CustomEvent('extensionResponse', {
                    detail: { 
                        success: false, 
                        message: 'Error checking extension status',
                        action: 'getSettings',
                        error: error.message
                    }
                }));
                
                const statusElement = document.getElementById('extensionStatus');
                if (statusElement) statusElement.textContent = 'Error';
            }
        });
        
        document.addEventListener('testStorage', async (event) => {
            console.log('🟡 [CONTENT SCRIPT] Custom event: testStorage received', event.detail);
            this.logger.info('Custom event: testStorage', event.detail);
            
            try {
                const profile = await StorageManager.load(STORAGE_KEYS.USER_PROFILE, {});
                console.log('🟡 [CONTENT SCRIPT] Profile loaded:', profile);
                
                // Send response back to test page
                const responseEvent = new CustomEvent('extensionResponse', {
                    detail: { 
                        success: true, 
                        message: 'Storage test successful',
                        action: 'getProfile',
                        data: profile
                    }
                });
                console.log('🟡 [CONTENT SCRIPT] Dispatching response event:', responseEvent);
                document.dispatchEvent(responseEvent);
                console.log('🟡 [CONTENT SCRIPT] Response event dispatched');
                
                // Update status element on test page
                const profileElement = document.getElementById('profileStatus');
                if (profileElement) {
                    const statusText = Object.keys(profile).length > 0 ? 
                        `${Object.keys(profile).length} fields saved` : 
                        'No profile data found';
                    profileElement.textContent = statusText;
                    console.log('🟡 [CONTENT SCRIPT] Updated profileStatus element:', statusText);
                }
                
            } catch (error) {
                console.error('🟡 [CONTENT SCRIPT] Error testing storage:', error);
                this.logger.error('Error testing storage', { error: error.message });
                
                document.dispatchEvent(new CustomEvent('extensionResponse', {
                    detail: { 
                        success: false, 
                        message: 'Error testing storage',
                        action: 'getProfile',
                        error: error.message
                    }
                }));
                
                const profileElement = document.getElementById('profileStatus');
                if (profileElement) profileElement.textContent = 'Error accessing storage';
            }
        });
        
        // Add a global variable to detect if content script is loaded
        window.contentScriptLoaded = true;
        console.log('🟡 [CONTENT SCRIPT] Content script loaded and event listeners set up');
        console.log('🟡 [CONTENT SCRIPT] Global variable set: window.contentScriptLoaded = true');
    }

    detectJobApplicationForm() {
        this.logger.info('Detecting job application form...');
        
        const formInfo = {
            site: this.currentSite,
            hasForm: false,
            fieldCount: 0,
            fieldTypes: {},
            url: window.location.href,
            timestamp: new Date().toISOString()
        };

        // Look for forms using selectors
        const forms = document.querySelectorAll(FORM_SELECTORS.join(','));
        this.logger.info('Forms found', { count: forms.length, selectors: FORM_SELECTORS });
        
        if (forms.length > 0) {
            formInfo.hasForm = true;
            formInfo.fieldCount = this.countFormFields(forms);
            formInfo.fieldTypes = this.analyzeFieldTypes(forms);
            
            this.logger.info('Job application form detected', formInfo);
            NotificationManager.show('Job application form detected!', 'success');
        } else {
            this.logger.info('No job application form detected');
        }

        return formInfo;
    }

    countFormFields(forms) {
        let count = 0;
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            count += inputs.length;
        });
        return count;
    }

    analyzeFieldTypes(forms) {
        const fieldTypes = {
            text: 0,
            email: 0,
            tel: 0,
            textarea: 0,
            select: 0,
            radio: 0,
            checkbox: 0,
            file: 0
        };

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const type = FormFieldUtils.getFieldType(input);
                if (fieldTypes.hasOwnProperty(type)) {
                    fieldTypes[type]++;
                }
            });
        });

        return fieldTypes;
    }

    getFormFields() {
        const fields = [];
        const forms = document.querySelectorAll(FORM_SELECTORS.join(','));
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const field = FormFieldUtils.extractFieldInfo(input);
                fields.push(field);
            });
        });

        return fields;
    }

    autoFillForm() {
        this.logger.info('Starting auto-fill process...', {
            autoFillEnabled: this.settings.autoFill,
            profileKeys: Object.keys(this.userProfile)
        });
        
        if (!this.settings.autoFill) {
            this.logger.info('Auto-fill is disabled');
            NotificationManager.show('Auto-fill is disabled. Enable it in settings.', 'warning');
            return;
        }

        if (Object.keys(this.userProfile).length === 0) {
            this.logger.warn('No user profile data available');
            NotificationManager.show('Please save your profile first!', 'error');
            return;
        }

        this.logger.info('Starting auto-fill process');
        const filledCount = this.fillFormFields();
        
        if (filledCount > 0) {
            NotificationManager.show(`Auto-filled ${filledCount} fields!`, 'success');
            this.trackApplication();
        } else {
            this.logger.warn('No fields were auto-filled');
            NotificationManager.show('No fields were auto-filled. Check form detection.', 'info');
        }
    }

    fillFormFields() {
        let filledCount = 0;
        const fieldMappings = this.getFieldMappings();
        
        console.log('🟡 [CONTENT SCRIPT] === FILL FORM FIELDS DEBUG ===');
        console.log('🟡 [CONTENT SCRIPT] User profile data:', this.userProfile);
        console.log('🟡 [CONTENT SCRIPT] Field mappings keys:', Object.keys(fieldMappings));
        
        this.logger.info('Filling form fields', { 
            mappings: Object.keys(fieldMappings),
            profile: Object.keys(this.userProfile)
        });

        Object.keys(fieldMappings).forEach(profileKey => {
            console.log(`🟡 [CONTENT SCRIPT] Processing profile key: ${profileKey}`);
            console.log(`🟡 [CONTENT SCRIPT] Profile value:`, this.userProfile[profileKey]);
            
            if (this.userProfile[profileKey]) {
                const selectors = fieldMappings[profileKey];
                const value = this.userProfile[profileKey];
                
                console.log(`🟡 [CONTENT SCRIPT] Attempting to fill ${profileKey} with value: ${value}`);
                console.log(`🟡 [CONTENT SCRIPT] Selectors:`, selectors);
                
                this.logger.info(`Attempting to fill ${profileKey}`, { value, selectors });
                
                if (this.fillField(selectors, value)) {
                    filledCount++;
                    console.log(`🟡 [CONTENT SCRIPT] ✅ Successfully filled ${profileKey}`);
                    this.logger.info(`Successfully filled ${profileKey}`, { value });
                } else {
                    console.log(`🟡 [CONTENT SCRIPT] ❌ Failed to fill ${profileKey}`);
                    this.logger.warn(`Failed to fill ${profileKey}`, { value, selectors });
                }
            } else {
                console.log(`🟡 [CONTENT SCRIPT] ⚠️ No profile data for ${profileKey}`);
                this.logger.debug(`No profile data for ${profileKey}`);
            }
        });

        console.log(`🟡 [CONTENT SCRIPT] Total fields filled: ${filledCount}`);
        this.logger.info('Form filling completed', { filledCount });
        return filledCount;
    }

    getFieldMappings() {
        // Basic field mappings for Phase 1
        return {
            fullName: [
                'input[name*="name" i]',
                'input[id*="name" i]',
                'input[placeholder*="name" i]',
                'input[data-testid*="name" i]',
                '#fullName',
                'input[name="fullName"]'
            ],
            email: [
                'input[type="email"]',
                'input[name*="email" i]',
                'input[id*="email" i]',
                'input[placeholder*="email" i]',
                '#email',
                'input[name="email"]'
            ],
            phone: [
                'input[type="tel"]',
                'input[name*="phone" i]',
                'input[id*="phone" i]',
                'input[placeholder*="phone" i]',
                '#phone',
                'input[name="phone"]'
            ],
            location: [
                'input[name*="location" i]',
                'input[id*="location" i]',
                'input[placeholder*="location" i]',
                '#location',
                'input[name="location"]'
            ],
            linkedin: [
                'input[name*="linkedin" i]',
                'input[id*="linkedin" i]',
                'input[placeholder*="linkedin" i]',
                '#linkedin',
                'input[name="linkedin"]'
            ],
            currentCompany: [
                'input[name*="company" i]',
                'input[id*="company" i]',
                'input[placeholder*="company" i]',
                '#currentCompany',
                'input[name="currentCompany"]'
            ],
            currentTitle: [
                'input[name*="title" i]',
                'input[id*="title" i]',
                'input[placeholder*="title" i]',
                '#currentTitle',
                'input[name="currentTitle"]'
            ],
            experienceYears: [
                'select[name*="experience" i]',
                'select[id*="experience" i]',
                'input[name*="experience" i]',
                '#experienceYears',
                'select[name="experienceYears"]'
            ],
            skills: [
                'textarea[name*="skill" i]',
                'textarea[id*="skill" i]',
                'input[name*="skill" i]',
                '#skills',
                'textarea[name="skills"]'
            ],
            education: [
                'textarea[name*="education" i]',
                'textarea[id*="education" i]',
                'input[name*="education" i]',
                '#education',
                'textarea[name="education"]'
            ],
            summary: [
                'textarea[name*="summary" i]',
                'textarea[id*="summary" i]',
                'textarea[name*="bio" i]',
                '#summary',
                'textarea[name="summary"]'
            ]
        };
    }

    fillField(selectors, value) {
        console.log(`🟡 [CONTENT SCRIPT] fillField called with value: ${value}`);
        console.log(`🟡 [CONTENT SCRIPT] Selectors to try:`, selectors);
        
        this.logger.debug(`Trying to fill field with value: ${value}`, { selectors });
        
        for (const selector of selectors) {
            console.log(`🟡 [CONTENT SCRIPT] Trying selector: "${selector}"`);
            const elements = document.querySelectorAll(selector);
            console.log(`🟡 [CONTENT SCRIPT] Found ${elements.length} elements for selector "${selector}"`);
            
            this.logger.debug(`Selector "${selector}" found ${elements.length} elements`);
            
            for (const element of elements) {
                console.log(`🟡 [CONTENT SCRIPT] Checking element:`, {
                    tagName: element.tagName,
                    type: element.type,
                    name: element.name,
                    id: element.id,
                    placeholder: element.placeholder,
                    value: element.value
                });
                
                if (FormFieldUtils.isFillableElement(element)) {
                    console.log(`🟡 [CONTENT SCRIPT] ✅ Element is fillable!`);
                    this.logger.debug(`Found fillable element`, { 
                        tagName: element.tagName,
                        type: element.type,
                        name: element.name,
                        id: element.id
                    });
                    
                    if (!element.value || element.value.trim() === '') {
                        console.log(`🟡 [CONTENT SCRIPT] Element is empty, filling it...`);
                        this.fillElement(element, value);
                        console.log(`🟡 [CONTENT SCRIPT] ✅ Element filled successfully!`);
                        return true;
                    } else {
                        console.log(`🟡 [CONTENT SCRIPT] Element already has value: ${element.value}`);
                        this.logger.debug(`Element already has value: ${element.value}`);
                    }
                } else {
                    console.log(`🟡 [CONTENT SCRIPT] ❌ Element is not fillable`);
                }
            }
        }
        
        console.log(`🟡 [CONTENT SCRIPT] ❌ No fillable elements found for any selector`);
        return false;
    }

    fillElement(element, value) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        this.logger.debug(`Filling element`, { tagName, type, value });
        
        if (tagName === 'select') {
            // Handle select dropdowns
            const options = Array.from(element.options);
            const matchingOption = options.find(option => 
                option.text.toLowerCase().includes(value.toLowerCase()) ||
                option.value.toLowerCase().includes(value.toLowerCase())
            );
            if (matchingOption) {
                element.value = matchingOption.value;
                this.logger.debug(`Selected option: ${matchingOption.text}`);
            }
        } else {
            // Handle text inputs and textareas
            element.value = value;
        }

        // Trigger events
        this.triggerEvents(element);
        this.logger.debug(`Element filled successfully`);
    }

    triggerEvents(element) {
        const events = ['input', 'change', 'focus', 'blur', 'keyup', 'keydown'];
        events.forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
    }

    async trackApplication() {
        if (!this.settings.trackApplications) return;

        try {
            const application = {
                id: IdGenerator.generate(),
                jobTitle: this.extractJobTitle(),
                company: this.extractCompany(),
                url: window.location.href,
                date: new Date().toISOString(),
                status: APPLICATION_STATUS.APPLIED,
                site: this.currentSite,
                formInfo: this.detectJobApplicationForm()
            };

            const applications = await StorageManager.loadLocal(STORAGE_KEYS.APPLICATIONS, []);
            applications.push(application);
            
            await StorageManager.saveLocal(STORAGE_KEYS.APPLICATIONS, applications);
            this.logger.info('Application tracked', application);
        } catch (error) {
            this.logger.error('Error tracking application', { error: error.message });
        }
    }

    extractJobTitle() {
        const selectors = [
            'h1',
            '.job-title',
            '[data-testid*="title"]',
            '.position-title'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return 'Unknown Position';
    }

    extractCompany() {
        const selectors = [
            '.company-name',
            '[data-testid*="company"]',
            '.employer-name'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return 'Unknown Company';
    }
}

// Initialize the content script when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Job Automation AI Content Script');
    setTimeout(() => {
        new ContentScript();
    }, 1000);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Content Loaded - Initializing Job Automation AI Content Script');
        setTimeout(() => {
            new ContentScript();
        }, 1000);
    });
} else {
    console.log('DOM already loaded - Initializing Job Automation AI Content Script immediately');
    setTimeout(() => {
        new ContentScript();
    }, 1000);
} 