import Location from './location';
import { rename } from 'fs';

export default class Sorter {
  static sort(path: string) {
    return new Promise((resolve, reject) => {
      const newLocation = Location.getNewLocation(path);
      if (newLocation !== path) {
        rename(path, newLocation, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }
}
