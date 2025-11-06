// task-manager.js
// Modul yang berisi semua logika bisnis (Clean Code).

import { loadTasks, saveTasks } from './task-data.js';

async function getNextId() {
    const tasks = await loadTasks();
    if (tasks.length === 0) {
        return 1;
    }
    const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    return maxId + 1;
}

export async function addTask(description) {
    try {
        const tasks = await loadTasks();
        const newId = await getNextId();

        const newTask = {
            id: newId,
            description: description,
            isCompleted: false,
        };

        tasks.push(newTask);
        await saveTasks(tasks); 
        
        console.log(`[+] Tugas ditambahkan: "${description}" (ID: ${newId})`);
    } catch (error) {
        console.error('Gagal menambahkan tugas:', error.message);
    }
}

export async function listTasks() {
    try {
        const tasks = await loadTasks();
        
        console.log('\n--- DAFTAR TUGAS ---');
        
        if (tasks.length === 0) {
            console.log('Tidak ada tugas dalam daftar.');
            return;
        }

        tasks.forEach(task => {
            const status = task.isCompleted ? '✓ Selesai' : '✗ Belum Selesai';
            console.log(`[${task.id}] ${task.description} (${status})`);
        });

        console.log('--------------------');
    } catch (error) {
        console.error('Gagal menampilkan daftar tugas:', error.message);
    }
}

export async function completeTask(id) {
    try {
        const tasks = await loadTasks();
        const taskId = parseInt(id, 10);
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            console.log(`[!] Tugas dengan ID ${taskId} tidak ditemukan.`);
            return;
        }

        tasks[taskIndex].isCompleted = true;
        await saveTasks(tasks);

        console.log(`[✓] Tugas ditandai selesai: "${tasks[taskIndex].description}" (ID: ${taskId})`);

    } catch (error) {
        console.error('Gagal menyelesaikan tugas:', error.message);
    }
}

export async function removeTask(id) {
    try {
        let tasks = await loadTasks();
        const taskId = parseInt(id, 10);
        
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== taskId);

        if (tasks.length === initialLength) {
            console.log(`[!] Tugas dengan ID ${taskId} tidak ditemukan.`);
            return;
        }

        await saveTasks(tasks);
        console.log(`[-] Tugas dengan ID ${taskId} telah dihapus.`);
    } catch (error) {
        console.error('Gagal menghapus tugas:', error.message);
    }
}