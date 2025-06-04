import { toBase64, fromBase64, getKeyFromPassword, decryptText } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    async function decryptfileIntoFormData(file) {
    const allowedExtensions = ['json'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        alert(`File type not allowed: ${file.name}`);
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        try {
            const data = JSON.parse(event.target.result);
            const masterPassword = document.getElementById('master-password').value;
            if (!masterPassword) {
                alert("Enter a master password..");
                return;
            }

            const salt = fromBase64(data.salt);
            const key = await getKeyFromPassword(masterPassword, salt);
            const container = document.getElementById('password-entries');
            container.innerHTML = ''; // Clear previous entries

            for (const entry of data.entries) {
                const site = await decryptText(entry.site, key);
                const login = await decryptText(entry.login, key);
                const password = await decryptText(entry.password, key);

                const entryDiv = document.createElement('div');
                entryDiv.classList.add('entry');
                entryDiv.innerHTML = `
                    <div class="site-input-wrapper">
                        <img class="site-icon" src="" alt="">
                        <input type="text" name="site" class="site-input" value="${site}">
                    </div>

                    <input type="text" name="login" value="${login}">
                    <input type="password" name="password" class="password-field" value="${password}" autocomplete="new-password">

                    <div class="strength-bar"><div class="strength-fill"></div></div>
                    <div class="entry-controls">
                        <button class="toggle-password" title="Show/Hide Password"><i class="fa-solid fa-eye-slash"></i></button>
                        <button class="delete-entry" title="Delete Entry"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;

                container.appendChild(entryDiv);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to decrypt file. Possibly incorrect master password or corrupt file.");
        }
    };

    reader.readAsText(file);
}

    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        decryptfileIntoFormData(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = fileInput.files[0];
        decryptfileIntoFormData(file);
    });
});
