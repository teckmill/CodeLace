// Core exports
export { Component } from './core/component';
export { EventHandler } from './utils/event-handler';

// Component exports
export { default as Alert } from './components/alert';
export { default as Card } from './components/card';
export { Tab } from './components/tab';
export { default as Modal } from './components/modal';
export { default as Navbar } from './components/navbar';
export { default as Dropdown } from './components/dropdown';

// RTL utilities
export const RTL = {
  /**
   * Check if the current document direction is RTL
   */
  isRTL(): boolean {
    return document.documentElement.dir === 'rtl';
  },

  /**
   * Set the document direction
   */
  setDirection(direction: 'ltr' | 'rtl'): void {
    document.documentElement.dir = direction;
    // Dispatch custom event for components to handle direction change
    document.documentElement.dispatchEvent(
      new CustomEvent('directionchange', { 
        detail: { direction },
        bubbles: true 
      })
    );
  },

  /**
   * Get the current document direction
   */
  getDirection(): 'ltr' | 'rtl' {
    return document.documentElement.dir as 'ltr' | 'rtl';
  },

  /**
   * Watch for direction changes
   */
  onDirectionChange(callback: (direction: 'ltr' | 'rtl') => void): () => void {
    const handler = (event: Event) => {
      if (event instanceof CustomEvent) {
        callback(event.detail.direction);
      }
    };

    document.documentElement.addEventListener('directionchange', handler);
    return () => document.documentElement.removeEventListener('directionchange', handler);
  },

  /**
   * Convert logical properties to physical properties based on direction
   */
  getLogicalToPhysical(direction: 'ltr' | 'rtl' = document.documentElement.dir as 'ltr' | 'rtl') {
    const isRTL = direction === 'rtl';
    return {
      start: isRTL ? 'right' : 'left',
      end: isRTL ? 'left' : 'right',
      marginStart: isRTL ? 'margin-right' : 'margin-left',
      marginEnd: isRTL ? 'margin-left' : 'margin-right',
      paddingStart: isRTL ? 'padding-right' : 'padding-left',
      paddingEnd: isRTL ? 'padding-left' : 'padding-right',
      borderStart: isRTL ? 'border-right' : 'border-left',
      borderEnd: isRTL ? 'border-left' : 'border-right'
    } as const;
  }
};

// Initialize RTL support
document.addEventListener('DOMContentLoaded', () => {
  // Set initial direction if not already set
  if (!document.documentElement.dir) {
    document.documentElement.dir = 'ltr';
  }

  // Add RTL detection class
  document.documentElement.classList.add('cl-rtl-detected');
});
