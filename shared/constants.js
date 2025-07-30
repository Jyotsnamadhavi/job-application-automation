// Shared Constants for Job Automation AI

/**
 * Supported Job Platforms
 */
export const SUPPORTED_SITES = {
    LEVER: 'lever',
    GREENHOUSE: 'greenhouse',
    WORKDAY: 'workday',
    LINKEDIN: 'linkedin'
};

export const SITE_URLS = {
    [SUPPORTED_SITES.LEVER]: 'jobs.lever.co',
    [SUPPORTED_SITES.GREENHOUSE]: 'boards.greenhouse.io',
    [SUPPORTED_SITES.WORKDAY]: 'workday.com',
    [SUPPORTED_SITES.LINKEDIN]: 'linkedin.com/jobs'
};

/**
 * Application Statuses
 */
export const APPLICATION_STATUS = {
    APPLIED: 'applied',
    INTERVIEW: 'interview',
    REJECTED: 'rejected',
    PENDING: 'pending',
    OFFER: 'offer'
};

/**
 * Form Field Types
 */
export const FIELD_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    TEL: 'tel',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    FILE: 'file'
};

/**
 * Agent Types
 */
export const AGENT_TYPES = {
    FORM_DETECTION: 'form-detection',
    FILLING: 'filling',
    TRACKER: 'tracker',
    SCRAPER: 'scraper',
    DEADLINE_WATCHER: 'deadline-watcher'
};

/**
 * Log Levels
 */
export const LOG_LEVELS = {
    DEBUG: 'debug',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
    USER_PROFILE: 'userProfile',
    SETTINGS: 'settings',
    APPLICATIONS: 'applications',
    LOGS: 'logs',
    AGENT_CONFIG: 'agentConfig'
};

/**
 * Default Settings
 */
export const DEFAULT_SETTINGS = {
    autoFill: true,
    trackApplications: true,
    generateCoverLetters: false,
    enableAI: false,
    enableScraping: false
};

/**
 * Form Selectors
 */
export const FORM_SELECTORS = [
    'form',
    '[role="form"]',
    '.application-form',
    '.job-application',
    '#application-form',
    '[data-testid*="form"]',
    '[data-testid*="application"]'
];

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
}; 