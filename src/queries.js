export const createTasksTableQuery = `
  CREATE TABLE tasks (
    id int NOT NULL AUTO_INCREMENT,
    task_parent_id int,
    title varchar(20) NOT NULL,
    description varchar(50) NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (task_parent_id) REFERENCES tasks(id)
  );
`;

export const createTaskQuery = (task) => `
    INSERT INTO tasks (${
      task.task_parent_id ? "task_parent_id," : ""
    } title, description, date) VALUES (${
  task.task_parent_id ? `${task.task_parent_id},` : ""
} '${task.title}', '${task.description}', '${task.date}');
`;

export const getTasksQuery = `SELECT * FROM tasks;`;
