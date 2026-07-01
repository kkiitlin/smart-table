import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — Заполнение выпадающих списков (вы уже это сделали!)
  Object.keys(indexes).forEach((elementName) => {
    if (elements && elements[elementName]) {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          return option;
        }),
      );
    }
  });

  // Возвращаем функцию applyFiltering, которая участвует в конвейере данных
  return (data, state, action) => {
    // @todo: #4.2 — Очистка конкретного поля фильтра при нажатии на крестик
    if (action && action.name === "clear") {
      // Ищем родительский контейнер (label с классом .filter-wrapper)
      const parent = action.parentElement;
      // Находим внутри него связанный инпут
      const input = parent ? parent.querySelector("input") : null;

      if (input) {
        input.value = ""; // Физически очищаем поле ввода на экране
      }

      // Нам также нужно стереть это значение из глобального стейта приложения
      const fieldName = action.dataset.field; // Узнаем имя поля (например, 'date' или 'customer')
      if (fieldName && state) {
        state[fieldName] = ""; // Сбрасываем фильтр в состоянии
      }
    }

    // @todo: #4.5 — Фильтруем массив данных, оставляя только подходящие строки
    return data.filter((row) => compare(row, state));
  };
}
