import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <>
      {" "}
      <img
        src="https://countryflagsapi.com/png/tr"
        alt="turkish flag"
        title="Turkish"
        width="30"
        height="24"
        onClick={() => i18n.changeLanguage("tr")}
      />{" "}
      <img
        src="https://countryflagsapi.com/png/gb"
        width="30"
        height="24"
        alt="english flag"
        title="English"
        onClick={() => i18n.changeLanguage("en")}
      />
    </>
  );
};

export default LanguageSelector;
