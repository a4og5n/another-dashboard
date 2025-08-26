# Internationalization (i18n)

This folder contains translation files for different languages. To add a new language:

1. Create a new JSON file named with the language code (e.g., `fr.json` for French)
2. Copy the structure from `en.json` and translate the values
3. Add the language code to the `locales` array in `middleware.ts`

## Usage

```tsx
// In server components:
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("home");
  return <h1>{t("title")}</h1>;
}

// In client components:
("use client");
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("common");
  return <button>{t("welcome")}</button>;
}
```
