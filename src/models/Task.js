import { ValidationError, InternalServerError } from "../error-types";

const getChildTask = (task, tasks) => {
  const { task_parent_id, ...restOfTask } = task;

  const childTask = tasks.find((e) => e.task_parent_id === task.id);
  return {
    ...restOfTask,
    child_task: childTask ? getChildTask(childTask, tasks) : null,
  };
};

export class Task {
  constructor(task = {}) {
    this.title = task.title;
    this.description = task.description;
    this.date = task.date;
    this.task_parent_id = task.task_parent_id || null;
  }

  createCallback(err, result, res) {
    if (err) throw new InternalServerError(err.message);

    const newTaskId = result.insertId;
    if (newTaskId)
      res.json({
        data: {
          id: newTaskId,
          title: this.title,
          description: this.description,
          date: this.date,
          task_parent_id: this.task_parent_id,
        },
      });
  }

  getCallback(err, result, res) {
    if (err) throw new InternalServerError(err.message);

    const tasks = result
      .filter((task) => !task.task_parent_id)
      .map((task) => getChildTask(task, result));
    res.json({ data: tasks });
  }

  validate() {
    if (!this.title && !this.description && !this.date) {
      throw new ValidationError(
        "The body is required with name, description and date properties"
      );
    }

    const invalidProperties = [];

    const isTitleInvalid = !this.validateTitle();
    const isDescriptionInvalid = !this.validateDescription();
    const isDateInvalid = !this.validateDate();

    isTitleInvalid && invalidProperties.push("title");
    isDescriptionInvalid && invalidProperties.push("description");
    isDateInvalid && invalidProperties.push("date");

    if (invalidProperties.length)
      throw new ValidationError(
        `The properties '${invalidProperties.join(", ")}' are invalid`
      );
  }

  validateTitle() {
    return this.title && this.title.length < 20;
  }

  validateDescription() {
    return this.description && this.description.length < 50;
  }

  validateDate() {
    return Boolean(this.date);
  }
}
