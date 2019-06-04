export default class NavigationUtil {
  static goBack(navigation) {
    navigation.goBack();
  }

  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate("Main");
  }
}