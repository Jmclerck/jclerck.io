import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'https://cdn.skypack.dev/web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
    if ('connection' in navigator &&
        navigator['connection'] &&
        'effectiveType' in navigator['connection']) {

        return navigator['connection']['effectiveType']
    }

    return '';
}

function sendToAnalytics(metric, options) {
    const body = {
        dsn: options.analyticsId,
        event_name: metric.name,
        href: location.href,
        id: metric.id,
        speed: getConnectionSpeed(),
        value: metric.value.toString(),
    };

    if (options.debug) {
        console.log('[Analytics]', metric.name, JSON.stringify(body, null, 2));
    }

    const blob = new Blob([new URLSearchParams(body).toString()], {
        type: 'application/x-www-form-urlencoded',
    });

    if (navigator.sendBeacon) {
        navigator.sendBeacon(vitalsUrl, blob);
    } else
        fetch(vitalsUrl, {
            body: blob,
            credentials: 'omit',
            keepalive: true,
            method: 'POST',
        });
}

export function webVitals(options) {
    try {
        getFID((metric) => sendToAnalytics(metric, options));
        getTTFB((metric) => sendToAnalytics(metric, options));
        getLCP((metric) => sendToAnalytics(metric, options));
        getCLS((metric) => sendToAnalytics(metric, options));
        getFCP((metric) => sendToAnalytics(metric, options));
    } catch (err) {
        console.error('[Analytics]', err);
    }
}
