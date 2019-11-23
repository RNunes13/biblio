
import axios from 'axios';

export function getLoans(user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get(`/api/book_loan/get_by_user.php?user_id=${user_id}`);

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
