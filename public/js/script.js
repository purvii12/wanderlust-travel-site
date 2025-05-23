// public/scripts/script.js (Improved with comments)
(() => {
    'use strict';
    
    // Bootstrap form validation handler
    const handleFormValidation = () => {
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', handleFormValidation);
})();
