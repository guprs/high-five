import { KID_THEMES } from "../data/themes";


export function getKidTheme(themeName:string) {

  return (
    KID_THEMES.find(
      theme =>
        theme.name === themeName
    )
    ??
    KID_THEMES[0]
  );

}