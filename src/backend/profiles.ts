import { App } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../stores/profiles/types';

export function loadProfiles(app: App): Profile[] {
// Create default profiles.
  const profilesDirectory = path.join(app.getPath('userData'), 'profiles');

  if (!fs.existsSync(profilesDirectory)) {
    console.log('Adding default profiles...');
    
    fs.mkdirSync(profilesDirectory);
    
    const profileAssetsPath = path.join(app.getAppPath(), 'assets', 'profiles');

    fs.readdirSync(profileAssetsPath).map(fileName => {
      fs.copyFileSync(path.join(profileAssetsPath, fileName), path.join(profilesDirectory, fileName));
    });
  }

  try {
    return fs.readdirSync(profilesDirectory)
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => ({
        ...JSON.parse(fs.readFileSync(path.join(profilesDirectory, fileName)).toString()),
        id: uuidv4(),
        fileName,
      }));
  } catch (e) {
    console.log(`Failed to load profiles: ${e}`);

    return [];
  }
}