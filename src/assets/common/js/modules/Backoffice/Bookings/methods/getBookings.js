
import axios from 'axios';

export function getBookings() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/booking/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
