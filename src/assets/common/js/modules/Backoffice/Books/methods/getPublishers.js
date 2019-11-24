
import axios from 'axios';

export function getPublishers() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/publisher/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
