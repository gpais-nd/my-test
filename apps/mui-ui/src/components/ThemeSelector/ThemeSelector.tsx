import React, { useState } from 'react';

const DarkTheme = React.lazy(() => import('./DarkTheme/'));
const DayTheme = React.lazy(() => import('./DayTheme/'));

const ThemeSelector = ({
  children,
  isDark,
}: {
  children: any;
  isDark: boolean;
}) => {
  const [isDarkMode, toggleDarkMode] = useState(isDark);
  const globalStyles = [...document.styleSheets];

  const toggleCallback = () => {
    toggleDarkMode(!isDarkMode);
  };

  return (
    <>
      <React.Suspense fallback={false}>
        {isDarkMode ? <DarkTheme /> : <DayTheme />}
      </React.Suspense>
      {globalStyles.forEach((gs, i) => {
        const rules = [...gs.cssRules];
        rules.forEach(rule => {
          if (isDarkMode) {
            if (rule.cssText.includes('--backgroundMain1: white')) {
              document.styleSheets[i].disabled = true;
            }
            if (rule.cssText.includes('--backgroundMain1: #060f2f')) {
              document.styleSheets[i].disabled = false;
            }
            return;
          }
          if (rule.cssText.includes('--backgroundMain1: white')) {
            document.styleSheets[i].disabled = false;
          }
          //@ts-ignore:
          if (rule.cssText.includes('--backgroundMain1: #060f2f')) {
            document.styleSheets[i].disabled = true;
          }
        });
      })}
      {React.cloneElement(children, { isDarkMode, toggleCallback })}
    </>
  );
};

export default ThemeSelector;
