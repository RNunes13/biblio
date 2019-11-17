
export const user = {
  logout(_, scope) {
    window.localStorage.removeItem('@Biblio:user');
    window.location.href = window.location.origin;
  },
};
