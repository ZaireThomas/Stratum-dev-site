import { toBase64, fromBase64, getKeyFromPassword, encryptText } from './utils.js';

async function encryptFormData(masterPassword) {
    const entries = document.querySelectorAll('#password-entries .entry');

    if (!masterPassword) {
        alert("Encryption cancelled.");
        return;
    }

    // Validate all fields before proceeding
    for (const entry of entries) {
        const site = entry.querySelector('input[name="site"]').value.trim();
        const login = entry.querySelector('input[name="login"]').value.trim();
        const password = entry.querySelector('input[name="password"]').value.trim();

        if (!site || !login || !password) {
            alert("Please fill out all fields in every entry before encrypting.");
            return;
        }
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await getKeyFromPassword(masterPassword, salt);

    const encryptedEntries = [];

    for (const entry of entries) {
        const site = entry.querySelector('input[name="site"]').value;
        const login = entry.querySelector('input[name="login"]').value;
        const password = entry.querySelector('input[name="password"]').value;

        const siteEncrypted = await encryptText(site, key);
        const loginEncrypted = await encryptText(login, key);
        const passwordEncrypted = await encryptText(password, key);

        encryptedEntries.push({
            site: siteEncrypted,
            login: loginEncrypted,
            password: passwordEncrypted
        });
    }

    const fileData = {
        salt: toBase64(salt),
        entries: encryptedEntries
    };

    const json = JSON.stringify(fileData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords_encrypted.json";
    a.click();

    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function () {
    const encryptButton = document.getElementById('encrypt-button');
    if (!encryptButton) {
        console.error("Encrypt button not found");
        return;
    }

    encryptButton.addEventListener('click', async function () {
        const masterInput = document.getElementById('master-password');
        const masterPassword = masterInput.value;

        if (!masterPassword || !isPasswordStrong(masterPassword)) {
            masterInput.classList.add('shake');
            setTimeout(() => masterInput.classList.remove('shake'), 500);
            return alert("Master password does not meet requirements.");
        }

        encryptFormData(masterPassword);
    });

    // Password strength check function
    function isPasswordStrong(pw) {
        return (
            pw.length >= 8 &&
            /[a-z]/.test(pw) &&        // lowercase
            /[A-Z]/.test(pw) &&        // uppercase
            /\d/.test(pw) &&           // number
            /[^A-Za-z0-9]/.test(pw) && // special character
            !/\s/.test(pw)             // no spaces
        );
    }
});
