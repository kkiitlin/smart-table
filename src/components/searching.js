import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    // Создаем массив правил сравнения: используем встроенное в библиотеку правило сквозного поиска
    const searchRules = [
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ];

    // Инициализируем функцию сравнения (компаратор) на основе этих правил
    const compare = createComparison(searchRules);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Фильтруем массив: оставляем только те строки, которые успешно прошли проверку компаратора
        return data.filter(row => compare(row, state));
    }
}