import type { NextConfig } from "next";
import withPWA from "next-pwa";
import path from "path";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const isProd = process.env.NODE_ENV === "production";

const withPWAWrapped = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
  buildExcludes: [/middleware-manifest\.json$/],
})(baseConfig);

export default withPWAWrapped;
