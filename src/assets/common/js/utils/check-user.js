
export function checkUser(redirect_to) {
  const user = JSON.parse(window.localStorage.getItem("@Biblio:user"));

  if (user) {
    return user;
  } else {
    window.location.href = window.location.origin + '/login.html';

    window.localStorage.setItem("@Biblio:redirectTo", redirect_to);

    return false;
  }
}
