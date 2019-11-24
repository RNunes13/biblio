
import axios from 'axios';

export function getRoles() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/role/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
