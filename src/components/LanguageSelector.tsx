'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const languages = [
    {
        code: 'de',
        name: 'Deutsch',
        flag: '🇩🇪'
    },
    {
        code: 'en',
        name: 'English',
        flag: '🇺🇸'
    },
    {
        code: 'fr',
        name: 'Français',
        flag: '🇫🇷'
    }
];

export default function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        // Navigate to the same page with the new locale
        router.replace(pathname, { locale: newLocale });
    };

    const currentLanguage = languages.find(lang => lang.code === locale);

    return (
        <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{currentLanguage?.flag}</span>
                        <span className="text-sm font-medium">{currentLanguage?.name}</span>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm">{language.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
} 