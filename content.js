class RokAdBlocker {
    constructor() {
        this.blockedAds = 0;
        this.adSelectors = [
            // Common ad selectors for OnlineKhabar
            '.advertisement',
            '.ad-banner',
            '.google-ads',
            '.adsense',
            '[id*="ad"]',
            '[class*="ad-"]',
            '[class*="ads-"]',
            '.sidebar-ads',
            '.header-ads',
            '.footer-ads',
            // OnlineKhabar specific selectors (you'll need to inspect the site)
            '.ok-ad-container',
            '.ok-advertisement',
            '#google_ads_iframe',
            '.google-ad-unit',
            '.ok-hot-topics-top',
            '.ok-full-widht-adv',
            '.left-fixed-items',
            '.nh_widget_wrap',
            '.ok-col-right',
            // Generic iframe ads
            'iframe[src*="doubleclick"]',
            'iframe[src*="googleads"]',
            'iframe[src*="googlesyndication"]',
            'iframe[src*="facebook.com/tr"]',
            // Social media trackers
            '[src*="facebook.com/tr"]',
            '[src*="google-analytics.com"]'
        ];

        this.init();
    }

    init() {
        // Block ads immediately
        this.blockAds();

        // Set up mutation observer for dynamically loaded ads
        this.setupMutationObserver();

        // Block ads again after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.blockAds());
        }

        // Block ads periodically (for dynamic content)
        setInterval(() => this.blockAds(), 2000);
    }

    blockAds() {
        this.adSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element && !element.hasAttribute('data-rok-blocked')) {
                        this.hideElement(element);
                        this.blockedAds++;
                    }
                });
            } catch (e) {
                console.warn('Rok: Error with selector', selector, e);
            }
        });
    }

    hideElement(element) {
        element.style.display = 'none !important';
        element.style.visibility = 'hidden !important';
        element.style.opacity = '0 !important';
        element.style.height = '0px !important';
        element.style.width = '0px !important';
        element.setAttribute('data-rok-blocked', 'true');

        // Also try to remove the element completely
        try {
            element.remove();
        } catch (e) {
            // If removal fails, just hide it
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldBlock = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldBlock = true;
                }
            });

            if (shouldBlock) {
                setTimeout(() => this.blockAds(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize the ad blocker
if (document.body) {
    new RokAdBlocker();
} else {
    document.addEventListener('DOMContentLoaded', () => new RokAdBlocker());
} 