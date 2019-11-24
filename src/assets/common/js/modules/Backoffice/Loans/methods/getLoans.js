
import axios from 'axios';

export function getLoans() {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get('/api/book_loan/read.php');

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
