import { getRequestConfig } from "next-intl/server";

// This is an example configuration for next-intl
export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? "en";
  return {
    messages: (await import(`./translations/${safeLocale}.json`)).default,
    locale: safeLocale,
  };
});
