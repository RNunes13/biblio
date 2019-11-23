
import axios from 'axios';

export function getBookings(user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await axios.get(`/api/booking/get_by_user.php?user_id=${user_id}`);

      resolve(resp.data);
    } catch (err) {
      reject(err);
    }
  });
}
