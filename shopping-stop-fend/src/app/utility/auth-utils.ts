export class AuthUtils {
  private static authToken = 'auth token';
  private static userType = 'user type';

  static getAuthToken() {
    return sessionStorage.getItem(AuthUtils.authToken);
  }

  static setAuthToken(value:any) {
    sessionStorage.setItem(AuthUtils.authToken, value);
  }

  static removeAuthToken() {
    sessionStorage.removeItem(AuthUtils.authToken);
  }
  
  static getUserType() {
    return sessionStorage.getItem(AuthUtils.userType);
  }

  static setUserType(value:any) {
    sessionStorage.setItem(AuthUtils.userType, value);
  }

  static removeUserType() {
    sessionStorage.removeItem(AuthUtils.userType);
  }
}
