/**
 * Anti-Inspect Script for Sinha Library
 * This script is currently disabled to allow debugging
 */

(function() {
    // All anti-inspection features are commented out to allow debugging
    
    /*
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // F12 key
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (Chrome, Firefox, Edge)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J (Chrome)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C (Chrome)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    });

    // Detect DevTools opening
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        if (widthThreshold || heightThreshold) {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Inspection Disabled</h1><p>Developer tools access is not allowed on this website.</p></div>';
        }
    }

    // Check periodically
    setInterval(detectDevTools, 1000);

    // Disable console access
    const consoleMessages = [
        'Inspection is disabled on this website.',
        'Please close developer tools to continue using the site.',
        'This is a security measure to protect the website content.'
    ];

    // Override console methods
    const consoleProperties = ['log', 'debug', 'info', 'warn', 'error', 'clear', 'dir', 'dirxml', 'trace', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'count', 'assert', 'profile', 'profileEnd', 'table', 'exception'];
    
    consoleProperties.forEach(prop => {
        if (window.console && window.console[prop]) {
            window.console[prop] = function() {
                console.warn(consoleMessages[Math.floor(Math.random() * consoleMessages.length)]);
            };
        }
    });

    // Disable source viewing
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    */

    console.log('Anti-inspection features are disabled for debugging purposes.');
})();
