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
const command = args[0];

switch (command) {
    case "add":
        addTask(args.slice(1));
        break;

    case "list":
        listTasks(args.slice(1));
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