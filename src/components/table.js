import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.slice().reverse().forEach(subName => {                            // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
}); 

    after.forEach(subName => {                            // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
}); 
    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => { 
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
    // Преобразуем массив объектов в массив готовых DOM-элементов строк
    const nextRows = data.map(item => {
        // 1. Клонируем шаблон строки (получаем объект с DOM-узлом и его элементами)
        const row = cloneTemplate(rowTemplate);

        // 2. Перебираем ключи объекта данных (например: 'date', 'customer', etc.)
        Object.keys(item).forEach(key => {
            // Проверяем, есть ли внутри склонированной строки элемент с таким data-name
            if (row.elements && row.elements[key]) {
                const element = row.elements[key];
                
                // 3. Проверяем тип тега элемента (хорошая практика)
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    element.value = item[key];
                } else {
                    element.textContent = item[key];
                }
            }
        });

        // Возвращаем сам DOM-узел строки (обычно это root или container внутри row)
        return row.container; 
    });

    // Очищаем старые строки и вставляем новые
    root.elements.rows.replaceChildren(...nextRows);
}

    return {...root, render};
}