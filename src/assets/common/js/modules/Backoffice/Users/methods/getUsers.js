
import axios from 'axios';

export function getUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/users/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
