export { Component } from './core/component';
export { EventHandler } from './utils/event-handler';
export { default as Alert } from './components/alert';
export { default as Card } from './components/card';
export { Tab } from './components/tab';
export { default as Modal } from './components/modal';
export { default as Navbar } from './components/navbar';
export { default as Dropdown } from './components/dropdown';
export declare const RTL: {
    /**
     * Check if the current document direction is RTL
     */
    isRTL(): boolean;
    /**
     * Set the document direction
     */
    setDirection(direction: "ltr" | "rtl"): void;
    /**
     * Get the current document direction
     */
    getDirection(): "ltr" | "rtl";
    /**
     * Watch for direction changes
     */
    onDirectionChange(callback: (direction: "ltr" | "rtl") => void): () => void;
    /**
     * Convert logical properties to physical properties based on direction
     */
    getLogicalToPhysical(direction?: "ltr" | "rtl"): {
        readonly start: "right" | "left";
        readonly end: "right" | "left";
        readonly marginStart: "margin-right" | "margin-left";
        readonly marginEnd: "margin-right" | "margin-left";
        readonly paddingStart: "padding-right" | "padding-left";
        readonly paddingEnd: "padding-right" | "padding-left";
        readonly borderStart: "border-right" | "border-left";
        readonly borderEnd: "border-right" | "border-left";
    };
};
