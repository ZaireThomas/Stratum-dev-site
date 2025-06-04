document.addEventListener('DOMContentLoaded', function () {

    // create a new entry button event listener
    const addEntryButton = document.getElementById('add-entry-button');
    addEntryButton.addEventListener('click', () => {
        const entries = document.getElementById('password-entries');
        const newEntry = document.createElement('div');
        newEntry.classList.add('entry');

        newEntry.innerHTML = `
        <div class="site-input-wrapper">
          <img class="site-icon" src="" alt="">
          <input type="text" name="site" placeholder="e.g. netflix" class="site-input">
        </div>

        <input type="text" name="login" placeholder="e.g. user@gmail.com">
        <input type="password" name="password" class="password-field" placeholder="Enter password" autocomplete="new-password">

        <div class="strength-bar"><div class="strength-fill"></div></div>
        <div class="entry-controls">
          <button class="toggle-password" title="Show/Hide Password"><i class="fa-solid fa-eye-slash"></i></button>
          <button class="delete-entry" title="Delete Entry"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

        entries.appendChild(newEntry);

        const siteInput = newEntry.querySelector('input[name="site"]');
        const icon = newEntry.querySelector('.site-icon');

        //gets icon for the site input. uses google's favicon service.
        siteInput.addEventListener('input', () => {
            const raw = siteInput.value.trim().toLowerCase();
            let domain = raw.includes('.') ? raw : `${raw}.com`;
            const iconURL = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;

            icon.src = iconURL;
            icon.style.display = 'inline-block';

            icon.onerror = () => {
                icon.style.display = 'none';
            };
        });
    });

    // Delete entry button event listener
    document.addEventListener('click', function (e) {
        const deleteBtn = e.target.closest('.delete-entry');
        if (deleteBtn) {
            const entry = deleteBtn.closest('.entry');
            if (entry) entry.remove();
        }
    });

    // Toggle password visibility event listener
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.toggle-password');
        if (toggleBtn) {
            const entry = toggleBtn.closest('.entry');
            const input = entry?.querySelector('input[name="password"]');
            const icon = toggleBtn.querySelector('i');

            if (input && icon) {
                const isHidden = input.type === 'password';
                input.type = isHidden ? 'text' : 'password';
                icon.classList.toggle('fa-eye', !isHidden);
                icon.classList.toggle('fa-eye-slash', isHidden);
            }
        }
    });

    // password strength bar event listener
    document.addEventListener('input', function (e) {
      if (e.target.classList.contains('password-field')) {
        const value = e.target.value;
        const fill = e.target.closest('.entry').querySelector('.strength-fill');
        let strength = 0;

        if (value.length >= 8) strength += 25;
        if (/[A-Z]/.test(value)) strength += 25;
        if (/[0-9]/.test(value)) strength += 25;
        if (/[^A-Za-z0-9]/.test(value)) strength += 25;

        fill.style.width = `${strength}%`;

        if (strength < 50) fill.style.backgroundColor = '#e74c3c';
        else if (strength < 75) fill.style.backgroundColor = '#f1c40f';
        else fill.style.backgroundColor = '#28a745';
      }
    });

});