import * as LDClient from "launchdarkly-js-client-sdk";

export default async ({ app }) => {
  const ldClient = LDClient.initialize("YOUR_SDK_KEY", {
    /* Configuration options */
  });

  // Make the LD client available as $ldClient in your Nuxt.js application

  // app.$ldClient = ldClient;
};