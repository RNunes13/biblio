
import axios from 'axios';

export function getBookingById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve([]);
    } catch (err) {
      reject(err);
    }
  });
}
