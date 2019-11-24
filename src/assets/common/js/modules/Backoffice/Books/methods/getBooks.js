
import axios from 'axios';

export function getBooks() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/admin/books/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
