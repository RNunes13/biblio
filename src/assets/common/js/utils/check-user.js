
export function checkUser(redirect_to) {
  const user = JSON.parse(window.localStorage.getItem("@Biblio:user"));

  if (user) {
    return user;
  } else {
    window.location.href = window.location.origin + `/login.html${redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : ''}`;

    return false;
  }
}
