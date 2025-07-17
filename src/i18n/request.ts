import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Statische Imports für alle unterstützten Locales
import deMessages from './de.json';
import enMessages from './en.json';
import frMessages from './fr.json';

const messages = {
    de: deMessages,
    en: enMessages,
    fr: frMessages
};

export default getRequestConfig(async ({ requestLocale }) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: messages[locale as keyof typeof messages]
    };
});