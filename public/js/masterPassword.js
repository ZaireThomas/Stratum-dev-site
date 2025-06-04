document.addEventListener('DOMContentLoaded', function () {

    // Toggle visibility for master password input
    const masterpasswordToggle = document.getElementById('toggle-master-visibility');
    masterpasswordToggle.addEventListener('click', function () {
      const input = document.getElementById('master-password');
      const icon = this.querySelector('i');
      const isHidden = input.style.webkitTextSecurity === 'disc';

      if (isHidden) {
        input.style.webkitTextSecurity = 'none';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        input.style.webkitTextSecurity = 'disc';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    });


    //display password Robustness
    const masterPasswordInput = document.getElementById('master-password');
    masterPasswordInput.addEventListener('input', function () {
      const val = this.value;

      const checks = {
        length: val.length >= 8,
        upper: /[A-Z]/.test(val),
        lower: /[a-z]/.test(val),
        number: /[0-9]/.test(val),
        special: /[^A-Za-z0-9]/.test(val),
        space: !/\s/.test(val),
      };

      for (const [key, passed] of Object.entries(checks)) {
        const el = document.getElementById(`check-${key}`);
        const icon = el.querySelector('i');

        icon.className = passed
          ? 'fa-solid fa-circle-check'
          : 'fa-solid fa-circle-xmark';

        icon.style.color = passed ? '#28a745' : 'rgba(255, 255, 255, 0.3)';
      }
    });
});