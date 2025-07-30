// Shared Utility Functions for Job Automation AI

import { STORAGE_KEYS, DEFAULT_SETTINGS, LOG_LEVELS } from './constants.js';

/**
 * Storage Utilities
 */
export class StorageManager {
    /**
     * Save data to Chrome storage
     */
    static async save(key, data) {
        try {
            await chrome.storage.sync.set({ [key]: data });
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }

    /**
     * Load data from Chrome storage
     */
    static async load(key, defaultValue = null) {
        try {
            const result = await chrome.storage.sync.get(key);
            return result[key] || defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    }

    /**
     * Save data to local storage
     */
    static async saveLocal(key, data) {
        try {
            await chrome.storage.local.set({ [key]: data });
            return true;
        } catch (error) {
            console.error('Local storage save error:', error);
            return false;
        }
    }

    /**
     * Load data from local storage
     */
    static async loadLocal(key, defaultValue = null) {
        try {
            const result = await chrome.storage.local.get(key);
            return result[key] || defaultValue;
        } catch (error) {
            console.error('Local storage load error:', error);
            return defaultValue;
        }
    }

    /**
     * Clear storage
     */
    static async clear(key) {
        try {
            await chrome.storage.sync.remove(key);
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
}

/**
 * Logger Utility
 */
export class Logger {
    constructor(agentType = 'system') {
        this.agentType = agentType;
    }

    log(message, level = LOG_LEVELS.INFO, context = {}) {
        const logEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            agentType: this.agentType,
            context
        };

        // Console logging
        const consoleMethod = level === LOG_LEVELS.ERROR ? 'error' : 
                             level === LOG_LEVELS.WARNING ? 'warn' : 'log';
        
        console[consoleMethod](`[${this.agentType}] ${message}`, context);

        // Store logs
        this.storeLog(logEntry);
    }

    async storeLog(logEntry) {
        try {
            const logs = await StorageManager.loadLocal(STORAGE_KEYS.LOGS, []);
            logs.push(logEntry);
            
            // Keep only last 1000 logs
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            await StorageManager.saveLocal(STORAGE_KEYS.LOGS, logs);
        } catch (error) {
            console.error('Failed to store log:', error);
        }
    }

    info(message, context = {}) {
        this.log(message, LOG_LEVELS.INFO, context);
    }

    warn(message, context = {}) {
        this.log(message, LOG_LEVELS.WARNING, context);
    }

    error(message, context = {}) {
        this.log(message, LOG_LEVELS.ERROR, context);
    }

    debug(message, context = {}) {
        this.log(message, LOG_LEVELS.DEBUG, context);
    }
}

/**
 * Site Detection Utility
 */
export class SiteDetector {
    static detectSite(url) {
        if (url.includes('jobs.lever.co')) return 'lever';
        if (url.includes('boards.greenhouse.io')) return 'greenhouse';
        if (url.includes('workday.com')) return 'workday';
        if (url.includes('linkedin.com/jobs')) return 'linkedin';
        return 'unknown';
    }

    static isJobApplicationPage(url) {
        const site = this.detectSite(url);
        return site !== 'unknown';
    }
}

/**
 * Form Field Utilities
 */
export class FormFieldUtils {
    static getFieldType(element) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        if (tagName === 'textarea') return 'textarea';
        if (tagName === 'select') return 'select';
        if (type === 'radio') return 'radio';
        if (type === 'checkbox') return 'checkbox';
        if (type === 'file') return 'file';
        if (type === 'email') return 'email';
        if (type === 'tel') return 'tel';
        
        return 'text';
    }

    static isFillableElement(element) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        return (
            tagName === 'input' ||
            tagName === 'textarea' ||
            tagName === 'select' ||
            element.contentEditable === 'true'
        );
    }

    static extractFieldInfo(element) {
        return {
            type: this.getFieldType(element),
            name: element.name || '',
            id: element.id || '',
            placeholder: element.placeholder || '',
            'data-testid': element.getAttribute('data-testid') || '',
            'aria-label': element.getAttribute('aria-label') || '',
            className: element.className || '',
            value: element.value || '',
            required: element.required || false,
            options: this.extractOptions(element)
        };
    }

    static extractOptions(element) {
        if (element.tagName.toLowerCase() === 'select') {
            return Array.from(element.options).map(option => ({
                value: option.value,
                text: option.textContent.trim()
            }));
        }
        return [];
    }
}

/**
 * Notification Utility
 */
export class NotificationManager {
    static show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;

        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
}

/**
 * ID Generator
 */
export class IdGenerator {
    static generate() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
} 