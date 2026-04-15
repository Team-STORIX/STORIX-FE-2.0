import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'kr.storix.app',
  appName: 'Storix',
  webDir: '.next',
  server: {
    url: 'https://storix-fe-2-0-nxvy.vercel.app/agreement',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
}

export default config
