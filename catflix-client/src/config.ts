import { AsyncStorage } from "react-native";

const CONFIG_KEY = 'CONFIG';

export type Config = {
  subtitleLang: 'eng' | 'spa' | null,
  quality: '1080p' | '720p' | null,
  device: string | null
}

const DEFAULT_CONFIG: Config = {
  subtitleLang: 'spa',
  quality: null,
  device: null
};

class ConfigHolder  {

  config: Config;

  async load() {
    const configValue = await AsyncStorage.getItem(CONFIG_KEY);
    if (!configValue) {
      this.config = {...DEFAULT_CONFIG};
      await this.set(this.config);
    }  else {
      this.config = JSON.parse(configValue)
    }
  }

  get() {
    return this.config;
  }

  async set(config: Config) {
    this.config = config;
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
  }

}

export const configHolder = new ConfigHolder();

