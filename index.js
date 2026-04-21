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

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    const tasks = saved ? JSON.parse(saved) : items;
    tasks.forEach((task) => {
        const item = createItem(task);
        listElement.append(item);
    });
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");

    textElement.textContent = item;

    deleteButton.addEventListener("click", () => {
        clone.remove();
        saveTasks(getTasksFromDOM());
    });

    duplicateButton.addEventListener("click", () => {
        const text = clone.querySelector(".to-do__item-text").textContent;
        const duplicate = createItem(text);
        clone.after(duplicate);
        saveTasks(getTasksFromDOM());
    });

    editButton.addEventListener("click", () => {
        const currentTextElement = clone.querySelector(".to-do__item-text");
        const currentText = currentTextElement.textContent;
        const input = document.createElement("input");
        input.className = "to-do__input";
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
            if (e.key === "Enter") input.blur();
        });
    });

    return clone;
}

function getTasksFromDOM() {
    const taskElements = listElement.querySelectorAll(".to-do__item-text");
    return Array.from(taskElements).map((el) => el.textContent);
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputElement.value.trim();
    if (!text) return;
    const item = createItem(text);
    listElement.append(item);
    saveTasks(getTasksFromDOM());
    inputElement.value = "";
});

loadTasks();
