// task-data.js
// Modul ini bertanggung jawab untuk operasi I/O file (membaca dan menulis) secara asinkron.

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const DATA_FILE = resolve('tasks.json');

export async function loadTasks() {
    try {
        const data = await readFile(DATA_FILE, { encoding: 'utf8' });
        return JSON.parse(data);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File tasks.json tidak ditemukan. Menginisialisasi daftar kosong.');
            return [];
        } 
        else if (error instanceof SyntaxError) {
            console.error('Error: Isi file tasks.json bukan JSON yang valid. Mengembalikan daftar kosong.');
            return [];
        } 
        else {
            console.error('Terjadi error fatal saat memuat tugas:', error.message);
            throw error;
        }
    }
}

export async function saveTasks(tasks) {
    try {
        const data = JSON.stringify(tasks, null, 2);
        await writeFile(DATA_FILE, data, { encoding: 'utf8' });
    } catch (error) {
        console.error('Terjadi error saat menyimpan tugas:', error.message);
        throw error;
    }
}