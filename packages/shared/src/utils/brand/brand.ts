// eslint-disable-next-line import/no-relative-packages
import config_data from '../../../../../brand.config.json';
import { appendLangParam } from '../url/helpers';

export const getBrandDomain = (): string => (config_data as any).brand_domain as string;
export const getBrandName = () => config_data.brand_name;
export const getBrandLogo = () => config_data.brand_logo;

export const isProduction = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === config_data.brand_hostname.production;
};

export const getBrandHostname = () =>
    substituteDerivDomain(isProduction() ? config_data.brand_hostname.production : config_data.brand_hostname.staging);
export const getBrandUrl = () => `https://${getBrandHostname()}`;
export const getBrandHomeUrl = (language?: string) => appendLangParam(`${getBrandUrl()}/home`, language);
export const getBrandLoginUrl = (language?: string) => appendLangParam(`${getBrandUrl()}/login`, language);
export const getBrandSignupUrl = (language?: string) => appendLangParam(`${getBrandUrl()}/signup`, language);
export const getPlatformName = () => config_data.platform.name;
export const getPlatformLogo = () => config_data.platform.logo;
export const getBrandLogoDark = (): string => ((config_data as any).brand_logo_dark as string) ?? config_data.brand_logo;
export const getPlatformDescription = (): string => ((config_data.platform as any).description as string) ?? '';

export const getAppId = (): number => {
    const app_id = (config_data as any).app_id as { staging: number; production: number } | undefined;
    if (!app_id) return 16929;
    return isProduction() ? app_id.production : app_id.staging;
};

export const getDomainName = () => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    if (!hostname) return '';
    const parts = hostname.split('.');
    return parts.length >= 2 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : '';
};

const substituteDerivDomain = (url: string): string => {
    const domain = getDomainName();
    if (!domain || domain !== getBrandDomain()) return url;
    try {
        const parsed = new URL(url);
        parsed.hostname = parsed.hostname.replace(/deriv.com$/, domain);
        return parsed.toString();
    } catch {
        return url.replace(/deriv.com/, domain);
    }
};

export const getTrustedDomainName = (): string => {
    const domain = getDomainName();
    return domain === getBrandDomain() ? domain : 'deriv.com';
};

const CLOUDFLARE_PAGES_PATTERN = /^[a-zA-Z0-9-]+\.derivatives-trader\.pages\.dev$/;
const VERCEL_PATTERN = /\.vercel\.app$/;

export const getRedirectHostname = (): string => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    const domain = getDomainName();
    if (domain === getBrandDomain()) return hostname;
    if (CLOUDFLARE_PAGES_PATTERN.test(hostname)) return hostname;
    if (VERCEL_PATTERN.test(hostname)) return hostname;
    return '';
};

export const getApiV4BaseUrl = (): string => {
    const derivws = (config_data as any).derivws as { staging: string; production: string } | undefined;
    if (!derivws) return 'https://api.derivws.com';
    return isProduction() ? derivws.production : derivws.staging;
};

export const getAuthBaseUrl = (): string => (isProduction() ? config_data.auth.production : config_data.auth.staging);

export const getOAuthClientId = (): string => {
    const client_id = process.env.OAUTH_CLIENT_ID;
    if (client_id) return client_id;
    return '345fXTHlirJcl6lAD618F';
};

export const getOAuthAppId = (): string => ((config_data.auth as any).oauth_app_id as string) ?? '';

export const getOAuthRedirectUri = (): string => {
    const auth = config_data.auth as any;
    return isProduction() ? auth.oauth_redirect_uri_production ?? '' : auth.oauth_redirect_uri_staging ?? '';
};

export const getWebSocketURL = (): string => {
    const base = isProduction() ? config_data.api_core.production : config_data.api_core.staging;
    return `${substituteDerivDomain(base)}/options/v1/ws`;
};

export const getWhoAmIURL = (): string => substituteDerivDomain(`${getAuthBaseUrl()}/sessions/whoami`);
export const getLogoutURL = (): string => substituteDerivDomain(`${getAuthBaseUrl()}/self-service/logout/browser`);
export const getApiCoreUrl = (): string => substituteDerivDomain(isProduction() ? config_data.api_core.production : config_data.api_core.staging);
export const getApiCoreBaseUrl = (): string => `https://${getApiCoreUrl()}`;
export const getApiUrl = (): string => substituteDerivDomain(isProduction() ? config_data.api.production : config_data.api.staging);
export const getApiBaseUrl = (): string => `https://${getApiUrl()}`;
export const getHomeUrl = (): string => substituteDerivDomain(((config_data.platform as any).home_url as string) ?? '');
export const getHelpCentreUrl = (): string => substituteDerivDomain(config_data.platform.help_centre_url);

export const getDepositUrl = (): string => {
    const deposit = (config_data as any).deposit_url as { staging: string; production: string } | undefined;
    if (!deposit) return '';
    return substituteDerivDomain(isProduction() ? deposit.production : deposit.staging);
};

export const getSignupUrl = (): string => {
    const signup = (config_data as any).signup_url as { staging: string; production: string } | undefined;
    if (!signup) return '';
    return substituteDerivDomain(isProduction() ? signup.production : signup.staging);
};

export const isFeatureEnabled = (feature: 'dark_mode' | 'language_switcher'): boolean => {
    const features = (config_data as any).features as Record<string, boolean> | undefined;
    return features?.[feature] ?? false;
};
