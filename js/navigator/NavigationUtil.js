export default class NavigationUtil {

  static goPage(params, page) {
    const navigation = NavigationUtil.navigation
    if(!navigation) {
      console.error('navigation can not be null');
      return;
    }
    navigation.navigate(
      page,
      {
        ...params,
      }
    )
  }

  static goBack(navigation) {
    navigation.goBack();
  }

  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate("Main");
  }
}