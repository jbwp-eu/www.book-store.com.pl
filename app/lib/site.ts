export const SITE_NAME = "My Portfolio";

export const SITE_DESCRIPTION =
  "Full-stack portfolio focused on online stores, commerce APIs, and CMS-driven sites.";

export function pageTitle(page?: string) {
  return page ? `${page} | ${SITE_NAME}` : SITE_NAME;
}
