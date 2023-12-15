import { Notification } from "../models/notification";
import { Task } from "../models/tasks";

export const createTask = async (data: any, user: string) => {
  if (!user) throw new Error("You need to be login");
  const createTask = await Task.create({
    title: data.title,
    description: data.description,
    createdBy: user,
    done: false,
  });
  if (!createTask) throw new Error("We could't create this task");
  const notification = await Notification.create({
    title: "Create task",
    notes: `New task created by ${user}`,
    createdBy: user,
    idReference: createTask.dataValues.id,
  });
  return createTask;
};

export const updateTask = async (id: string, data: any, user: string) => {
  if (!user) throw new Error("You need to be login");
  const findTask = await Task.findByPk(id);
  if (!findTask) throw new Error("Not found this task");
  if (findTask.dataValues.createdBy !== user)
    throw new Error("User not created this task");
  await findTask.update(data);
  await findTask.save();
  const notification = await Notification.create({
    title: "Update task",
    notes: `Updated task by ${user}`,
    createdBy: user,
    idReference: findTask.dataValues.id,
  });

  return findTask;
};
export const getTasks = async () => {
  const tasks = await Task.findAll();
  if (!tasks) throw new Error("There isn't tasks");
  return tasks;
};
export const getTaskId = async (id: string) => {
  const tasks = await Task.findByPk(id);
  if (!tasks) throw new Error("There isn't task");
  return tasks;
};
export const deleteTask = async (id: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("There isn't task");
  await task.destroy();
  return { message: "Successfull delete" };
};
export const deleteManyTasks = async (ids: any) => {
  const { arrayIds } = ids;
  const results = await Promise.all(
    arrayIds.map(async (id: string) => {
      try {
        const task = await Task.findByPk(id);
        if (!task) throw new Error("There isn't task");

        await task.destroy();
        return { id, message: "Successfull delete" };
      } catch (error: any) {
        return { id, error: error.message };
      }
    })
  );
  return results;
};

export const completeTask = async (id: string, value: boolean) => {
  console.log("valor", value);

  const findTask = await Task.findByPk(id);
  if (!findTask) throw new Error("Task not found");
  await findTask.update({
    done: value,
  });
  await findTask.save();

  return findTask;
};
