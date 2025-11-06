// index.js
// File utama untuk parsing argumen Command Line Interface (CLI) dan menjalankan perintah.

import { addTask, listTasks, completeTask, removeTask } from './task-manager.js';
import { argv } from 'process';

const [,, command, ...args] = argv;

function displayHelp() {
    console.log(`
--- Task Manager CLI ---
Penggunaan: node index.js <perintah> [argumen]

Perintah yang Tersedia:
  add "<deskripsi>"  Menambahkan tugas baru. (Wajib tanda kutip untuk spasi)
  list               Menampilkan semua tugas.
  done <id>          Menandai tugas sebagai selesai. (Gunakan ID berupa angka)
  remove <id>        Menghapus tugas. (Gunakan ID berupa angka)
  help               Menampilkan panduan ini.

Contoh:
  node index.js add "Mengerjakan tugas async Node.js"
  node index.js list
  node index.js done 1
----------------------
    `);
}

async function main() {
    try {
        switch (command) {
            case 'add':
                const description = args.join(' '); 
                if (!description) {
                    console.error('Error: Deskripsi tugas tidak boleh kosong.');
                    displayHelp();
                } else {
                    await addTask(description);
                }
                break;

            case 'list':
                await listTasks();
                break;

            case 'done':
            case 'remove':
                const id = parseInt(args[0], 10);
                if (isNaN(id) || id <= 0) {
                    console.error(`Error: Perintah ${command} memerlukan ID tugas yang valid (angka positif).`);
                    displayHelp();
                    return;
                }
                
                if (command === 'done') {
                    await completeTask(id);
                } else {
                    await removeTask(id);
                }
                break;

            case 'help':
            case undefined:
                displayHelp();
                break;

            default:
                console.error(`Error: Perintah tidak dikenal: ${command}`);
                displayHelp();
                break;
        }
    } catch (error) {
        console.error('Terjadi kesalahan fatal saat menjalankan aplikasi:', error.message);
    }
}

main();