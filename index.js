let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
// Загрузка задач при старте
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    const tasks = saved ? JSON.parse(saved) : items;
    
    // Очищаем список перед загрузкой (на случай перезапуска)
    listElement.innerHTML = "";
    
    tasks.forEach((task) => {
        const item = createItem(task);
        listElement.append(item); // При загрузке добавляем в конец, чтобы сохранить порядок массива
    });
}
// Создание элемента списка
function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    textElement.textContent = item;
    // Удаление
    deleteButton.addEventListener("click", () => {
        clone.remove();
        saveTasks(getTasksFromDOM());
    });
    // Дублирование (вставляет сразу ПОСЛЕ текущего элемента)
    duplicateButton.addEventListener("click", () => {
        const text = clone.querySelector(".to-do__item-text").textContent;
        const duplicate = createItem(text);
        clone.after(duplicate);
        saveTasks(getTasksFromDOM());
    });
    // Редактирование
    editButton.addEventListener("click", () => {
        const currentTextElement = clone.querySelector(".to-do__item-text");
        // Проверка: если мы уже в режиме редактирования (инпут уже есть), ничего не делаем
        if (clone.querySelector(".to-do__input_edit")) return;
        const currentText = currentTextElement.textContent;
        const input = document.createElement("input");
        input.className = "to-do__input to-do__input_edit"; // Добавил спец класс, чтобы не путать с основным инпутом
        input.value = currentText;
        
        currentTextElement.replaceWith(input);
        input.focus();
        function finishEdit() {
            const newText = input.value.trim();
            const newSpan = document.createElement("span");
            newSpan.className = "to-do__item-text";
            newSpan.textContent = newText || currentText;
            input.replaceWith(newSpan);
            saveTasks(getTasksFromDOM());
        }
        input.addEventListener("blur", finishEdit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finishEdit(); // Вызываем завершение напрямую
        });
    });
    return clone;
}
// Получение всех текстов задач из DOM для сохранения
function getTasksFromDOM() {
    const taskElements = listElement.querySelectorAll(".to-do__item-text");
    return Array.from(taskElements).map((el) => el.textContent);
}
// Сохранение в LocalStorage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Обработка формы (добавление НОВОЙ задачи)
formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputElement.value.trim();
    
    if (!text) return;
    
    const item = createItem(text);
    
    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: prepend вместо append
    listElement.prepend(item); 
    
    saveTasks(getTasksFromDOM());
    inputElement.value = "";
});
// Инициализация
loadTasks();
