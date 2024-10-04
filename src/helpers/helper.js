const translations = {
  en: {
    executionError: "There was an error during execution.",
    invalidLanguage: "Invalid programming language.",
    problemNotFound: "Problem not found.",
  },
  uz: {
    executionError: "Ijro jarayonida xato yuz berdi.",
    invalidLanguage: "Noto'g'ri dasturlash tili.",
    problemNotFound: "Muammo topilmadi.",
  },
  ru: {
    executionError: "Произошла ошибка во время выполнения.",
    invalidLanguage: "Неверный язык программирования.",
    problemNotFound: "Проблема не найдена.",
  },
};

function getTranslation(key, language) {
  return translations[language]?.[key] || translations["en"][key];
}

module.exports = { getTranslation };
