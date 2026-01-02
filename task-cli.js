#!/usr/bin/env node
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const TASK_FILE = join(process.cwd(), 'tasks.json');

// console.log("task file:", TASK_FILE);
function ensureTaskFile() {
    if (!existsSync(TASK_FILE)) {
        writeFileSync(TASK_FILE, JSON.stringify([], null, 2));
        return;
    }

    const content = readFileSync(TASK_FILE, "utf-8").trim();
    if (!content) {
        writeFileSync(TASK_FILE, JSON.stringify([], null, 2));
    }
}

ensureTaskFile();

function readTasks() {
    const data = readFileSync(TASK_FILE, "utf-8");
    return JSON.parse(data);
}

function writeTasks(tasks) {
    writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

const args = process.argv.slice(2);
// console.log(args);
const command = args[0];

switch (command) {
    case "add":
        addTask(args.slice(1));
        break;

    case "list":
        listTasks(args.slice(1));
        break;

    case "delete":
        deleteTask(args.slice(1));
        break;

    case "update":
        update(args.slice(1));
        break;

    default:
        console.log("Unknown command");
}

function addTask(params) {
    const description = params.join(" ");

    if (!description) {
        console.log("Task description is required");
        return;
    }

    const tasks = readTasks();

    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);

    console.log(`Task added successfully (ID: ${newTask.id})`);
}
/** testing command
 * node task-cli.js add "Tasks here..."
 */

function listTasks(params) {
    const filter = params[0];
    let tasks = readTasks();

    if (filter) {
        if (!["todo", "in-progress", "done"].includes(filter)) {
            console.log("Invalid status filter");
            return;
        }
        tasks = tasks.filter(task => task.status === filter);
    }

    if (tasks.length === 0) {
        console.log("No tasks found");
        return;
    }

    tasks.forEach(task => {
        console.log(
            `[${task.id}] ${task.description} - ${task.status}`
        );
    });
}
/** testing command
 * node task-cli.js list todo
 */

function deleteTask(params) {
    const id = parseInt(params[0]);

    if (!id) {
        console.log("Provide a valid task ID");
        return;
    }

    const tasks = readTasks();
    const filtered = tasks.filter(t => t.id !== id);

    if (tasks.length === filtered.length) {
        console.log("Task not found");
        return;
    }

    writeTasks(filtered);
    console.log("Task deleted successfully");
}

/** testing command
 * node task-cli.js delete 1
 */

function printHelp() {
    console.log(`
Usage: task-cli <command> [options]

Commands:
  add <description>       Add a new task
  list [status]           List all tasks or filter by status (todo, in-progress, done)
  delete <id>             Delete a task by ID
`);
}

if (!command) {
    printHelp();
}

if (command === "--help" || command === "-h") {
    printHelp();
}
/** testing command
 * node task-cli
 * node task-cli -h
 * node task-cli --help
 * node task-cli add "New Task"
 * node task-cli list
 * node task-cli list todo
 * node task-cli delete 1
 */

function update(params) {
    const id = parseInt(params[0]);
    const status = params[1];

    if (!id || !status || !["todo", "in-progress", "done"].includes(status)) {
        console.log("Provide a valid task ID and status (todo, in-progress, done)");
        return;
    }

    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
        console.log("Task not found");
        return;
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);

    console.log("Task updated successfully");
}
/** testing command
 * node task-cli update 2 done
 */