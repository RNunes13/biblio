
import axios from 'axios';

export function getBookings() {
  return new Promise(async (resolve, reject) => {
    try {
      resolve([]);
    } catch (err) {
      reject(err);
    }
  });
}
