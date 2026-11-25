import { BRAND } from '@/lib/brand-data';

/**
 * buildBrandJson projects the BRAND constant into the machine-readable shape
 * served at /brand.json. Semantic token names stay constant while their values
 * change per mode, so the `modes` map is the part most tools want. Pure
 * function of BRAND.
 */
export function buildBrandJson() {
  return {
    metadata: {
      version: BRAND.meta.version,
      revision: BRAND.meta.revision,
      lastUpdated: BRAND.meta.lastUpdated,
      status: BRAND.meta.status,
      description: BRAND.meta.description,
    },
    identity: BRAND.identity,
    artifacts: BRAND.artifacts,
    pillars: BRAND.pillars,
    principles: BRAND.principles,
    colors: {
      identity: BRAND.colors.identity,
      light: BRAND.colors.light,
      dark: BRAND.colors.dark,
      contrast: BRAND.colors.contrast,
      gateRule: BRAND.colors.gateRule,
    },
    modes: BRAND.modes,
    typography: BRAND.typography,
    logos: {
      ...BRAND.logos,
      // Absolute URLs, so a tool can fetch a mark without knowing the site.
      assets: BRAND.logos.assets.map((asset) => ({
        ...asset,
        url: `${BRAND.identity.url}${asset.path}`,
      })),
    },
    pattern: BRAND.pattern,
    iconography: BRAND.iconography,
    motion: BRAND.motion,
    components: {
      rules: BRAND.components.rules,
      buttons: BRAND.components.buttons,
      inspectionTag: BRAND.components.inspectionTag,
      outcomes: BRAND.components.outcomes,
    },
    applications: BRAND.applications,
    voice: BRAND.voice,
    taglines: BRAND.taglines,
    terminology: BRAND.terminology,
    guidelines: BRAND.guidelines,
    visualPersonality: BRAND.visualPersonality,
  };
}

export type BrandJson = ReturnType<typeof buildBrandJson>;
