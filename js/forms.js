/* ===============================================
   marshallairline Aviation - Form Handling System
   =============================================== */

(function() {
    'use strict';

    // Form configuration
    const config = {
        showValidationOnSubmit: true,
        showValidationOnBlur: true,
        debounceTime: 300,
        submitTimeout: 30000,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    };

    // Form state
    const formStates = new Map();
    const validationRules = new Map();

    // Initialize forms when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeForms();
        setupValidationRules();
        initializeCustomElements();
    });

    // Initialize all forms
    function initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            setupForm(form);
        });
    }

    // Setup individual form
    function setupForm(form) {
        const formId = form.id || generateFormId();
        form.id = formId;
        
        // Initialize form state
        formStates.set(formId, {
            isValid: false,
            isDirty: false,
            isSubmitting: false,
            errors: new Map(),
            data: new FormData()
        });
        
        // Setup form events
        form.addEventListener('submit', handleFormSubmit);
        form.addEventListener('input', debounce(handleFormInput, config.debounceTime));
        form.addEventListener('change', handleFormChange);
        form.addEventListener('reset', handleFormReset);
        
        // Setup field events
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            setupField(field, formId);
        });
        
        // Setup custom form features
        setupFormProgress(form);
        setupAutoSave(form);
        setupFileUploads(form);
    }

    // Setup individual field
    function setupField(field, formId) {
        field.addEventListener('blur', () => {
            if (config.showValidationOnBlur || formStates.get(formId).isDirty) {
                validateField(field, formId);
            }
        });
        
        field.addEventListener('focus', () => {
            clearFieldError(field);
        });
        
        // Setup specific field types
        if (field.type === 'email') {
            setupEmailField(field);
        } else if (field.type === 'tel') {
            setupPhoneField(field);
        } else if (field.type === 'date') {
            setupDateField(field);
        }
    }

    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formId = form.id;
        const formState = formStates.get(formId);
        
        if (formState.isSubmitting) {
            return;
        }
        
        // Validate entire form
        const isValid = validateForm(form);
        
        if (isValid) {
            submitForm(form);
        } else {
            showValidationSummary(form);
            focusFirstError(form);
        }
    }

    // Handle form input
    function handleFormInput(event) {
        const field = event.target;
        const form = field.closest('form');
        const formId = form.id;
        const formState = formStates.get(formId);
        
        formState.isDirty = true;
        updateFormData(form);
        
        // Real-time validation for specific fields
        if (field.type === 'email' || field.type === 'tel' || field.hasAttribute('data-validate-realtime')) {
            validateField(field, formId);
        }
    }

    // Handle form change
    function handleFormChange(event) {
        const field = event.target;
        const form = field.closest('form');
        
        updateFormData(form);
        
        // Handle specific field changes
        if (field.type === 'file') {
            handleFileChange(field);
        } else if (field.classList.contains('conditional-trigger')) {
            handleConditionalFields(field);
        }
    }

    // Handle form reset
    function handleFormReset(event) {
        const form = event.target;
        const formId = form.id;
        const formState = formStates.get(formId);
        
        // Reset form state
        formState.isValid = false;
        formState.isDirty = false;
        formState.errors.clear();
        
        // Clear all field errors
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => clearFieldError(field));
        
        // Hide validation summary
        hideValidationSummary(form);
    }

    // Validate entire form
    function validateForm(form) {
        const formId = form.id;
        const formState = formStates.get(formId);
        let isValid = true;
        
        formState.errors.clear();
        
        const fields = form.querySelectorAll('input[required], textarea[required], select[required], [data-validate]');
        fields.forEach(field => {
            if (!validateField(field, formId)) {
                isValid = false;
            }
        });
        
        // Custom form validation
        const customValidation = getCustomValidation(form);
        if (customValidation && !customValidation(form)) {
            isValid = false;
        }
        
        formState.isValid = isValid;
        return isValid;
    }

    // Validate individual field
    function validateField(field, formId) {
        const formState = formStates.get(formId);
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        formState.errors.delete(fieldName);
        clearFieldError(field);
        
        const value = field.value.trim();
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = getFieldLabel(field) + ' is required';
        }
        
        // Type-specific validation
        if (value && isValid) {
            switch (field.type) {
                case 'email':
                    if (!isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'tel':
                    if (!isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
                    
                case 'url':
                    if (!isValidURL(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid URL';
                    }
                    break;
                    
                case 'date':
                    if (!isValidDate(value, field)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid date';
                    }
                    break;
                    
                case 'number':
                    const min = field.getAttribute('min');
                    const max = field.getAttribute('max');
                    if (min && parseFloat(value) < parseFloat(min)) {
                        isValid = false;
                        errorMessage = `Value must be at least ${min}`;
                    } else if (max && parseFloat(value) > parseFloat(max)) {
                        isValid = false;
                        errorMessage = `Value must not exceed ${max}`;
                    }
                    break;
            }
        }
        
        // Length validation
        if (value && isValid) {
            const minLength = field.getAttribute('minlength');
            const maxLength = field.getAttribute('maxlength');
            
            if (minLength && value.length < parseInt(minLength)) {
                isValid = false;
                errorMessage = `Must be at least ${minLength} characters long`;
            } else if (maxLength && value.length > parseInt(maxLength)) {
                isValid = false;
                errorMessage = `Must not exceed ${maxLength} characters`;
            }
        }
        
        // Pattern validation
        if (value && isValid && field.hasAttribute('pattern')) {
            const pattern = new RegExp(field.getAttribute('pattern'));
            if (!pattern.test(value)) {
                isValid = false;
                errorMessage = field.getAttribute('data-pattern-message') || 'Invalid format';
            }
        }
        
        // Custom validation
        const customValidator = getFieldValidator(field);
        if (customValidator && isValid) {
            const customResult = customValidator(value, field);
            if (customResult !== true) {
                isValid = false;
                errorMessage = customResult || 'Invalid value';
            }
        }
        
        // Store error and show if invalid
        if (!isValid) {
            formState.errors.set(fieldName, errorMessage);
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    // Submit form
    async function submitForm(form) {
        const formId = form.id;
        const formState = formStates.get(formId);
        
        formState.isSubmitting = true;
        showFormLoading(form);
        
        try {
            const formData = new FormData(form);
            const submitHandler = getSubmitHandler(form);
            
            let result;
            if (submitHandler) {
                result = await submitHandler(formData, form);
            } else {
                result = await defaultSubmitHandler(formData, form);
            }
            
            if (result.success) {
                handleSubmitSuccess(form, result);
            } else {
                handleSubmitError(form, result.error || 'Submission failed');
            }
            
        } catch (error) {
            handleSubmitError(form, error.message);
        } finally {
            formState.isSubmitting = false;
            hideFormLoading(form);
        }
    }

    // Default submit handler
    async function defaultSubmitHandler(formData, form) {
        const action = form.getAttribute('action') || '#';
        const method = form.getAttribute('method') || 'POST';
        
        if (action === '#') {
            // Simulate submission for demo
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { success: true, message: 'Form submitted successfully!' };
        }
        
        const response = await fetch(action, {
            method: method,
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Network error occurred');
        }
    }

    // Handle successful submission
    function handleSubmitSuccess(form, result) {
        showSuccessMessage(form, result.message || 'Form submitted successfully!');
        
        // Reset form if specified
        if (form.hasAttribute('data-reset-on-success')) {
            form.reset();
        }
        
        // Redirect if specified
        const redirectUrl = form.getAttribute('data-redirect');
        if (redirectUrl) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        }
    }

    // Handle submission error
    function handleSubmitError(form, error) {
        showErrorMessage(form, error);
    }

    // Validation helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    function isValidDate(date, field) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return false;
        
        // Check min/max dates
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');
        
        if (min && dateObj < new Date(min)) return false;
        if (max && dateObj > new Date(max)) return false;
        
        return true;
    }

    // UI helper functions
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.parentNode.removeChild(errorElement);
                }
            }, 300);
        }
    }

    function showValidationSummary(form) {
        const formState = formStates.get(form.id);
        const errors = Array.from(formState.errors.values());
        
        if (errors.length === 0) return;
        
        let summaryElement = form.querySelector('.validation-summary');
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.className = 'validation-summary alert alert-error';
            form.insertBefore(summaryElement, form.firstChild);
        }
        
        summaryElement.innerHTML = `
            <div class="alert-icon">⚠</div>
            <div class="alert-content">
                <div class="alert-title">Please correct the following errors:</div>
                <ul class="error-list">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        
        summaryElement.style.display = 'flex';
    }

    function hideValidationSummary(form) {
        const summaryElement = form.querySelector('.validation-summary');
        if (summaryElement) {
            summaryElement.style.display = 'none';
        }
    }

    function showFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            const originalText = submitButton.textContent;
            submitButton.dataset.originalText = originalText;
            submitButton.innerHTML = '<div class="loading-spinner-small"></div> Submitting...';
        }
    }

    function hideFormLoading(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.textContent = submitButton.dataset.originalText || 'Submit';
        }
    }

    function showSuccessMessage(form, message) {
        showFormMessage(form, message, 'success');
    }

    function showErrorMessage(form, message) {
        showFormMessage(form, message, 'error');
    }

    function showFormMessage(form, message, type) {
        let messageElement = form.querySelector('.form-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = `form-message alert alert-${type}`;
            form.insertBefore(messageElement, form.firstChild);
        } else {
            messageElement.className = `form-message alert alert-${type}`;
        }
        
        const icon = type === 'success' ? '✓' : '⚠';
        messageElement.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <div class="alert-message">${message}</div>
            </div>
        `;
        
        messageElement.style.display = 'flex';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    function focusFirstError(form) {
        const firstErrorField = form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Custom form features
    function setupFormProgress(form) {
        const progressSteps = form.querySelectorAll('.form-step');
        if (progressSteps.length > 1) {
            initializeMultiStepForm(form, progressSteps);
        }
    }

    function setupAutoSave(form) {
        if (form.hasAttribute('data-autosave')) {
            const interval = parseInt(form.getAttribute('data-autosave')) || 30000;
            setInterval(() => {
                saveFormData(form);
            }, interval);
            
            // Load saved data on page load
            loadFormData(form);
        }
    }

    function setupFileUploads(form) {
        const fileInputs = form.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            setupFileInput(input);
        });
    }

    // File upload handling
    function setupFileInput(input) {
        input.addEventListener('change', (e) => {
            handleFileChange(e.target);
        });
        
        // Drag and drop support
        const dropZone = input.closest('.file-drop-zone');
        if (dropZone) {
            setupFileDragAndDrop(dropZone, input);
        }
    }

    function handleFileChange(input) {
        const files = Array.from(input.files);
        const maxSize = config.maxFileSize;
        const allowedTypes = config.allowedFileTypes;
        
        let isValid = true;
        let errors = [];
        
        files.forEach(file => {
            // Check file size
            if (file.size > maxSize) {
                errors.push(`${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`);
                isValid = false;
            }
            
            // Check file type
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(extension)) {
                errors.push(`${file.name} has an unsupported file type`);
                isValid = false;
            }
        });
        
        if (!isValid) {
            showFieldError(input, errors.join(', '));
            input.value = '';
        } else {
            clearFieldError(input);
            displayFilePreview(input, files);
        }
    }

    function displayFilePreview(input, files) {
        let previewContainer = input.parentNode.querySelector('.file-preview');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'file-preview';
            input.parentNode.appendChild(previewContainer);
        }
        
        previewContainer.innerHTML = files.map(file => `
            <div class="file-preview-item">
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            </div>
        `).join('');
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Utility functions
    function generateFormId() {
        return 'form-' + Math.random().toString(36).substr(2, 9);
    }

    function getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name || 'Field';
    }

    function updateFormData(form) {
        const formState = formStates.get(form.id);
        formState.data = new FormData(form);
    }

    function saveFormData(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(`form-data-${form.id}`, JSON.stringify(data));
    }

    function loadFormData(form) {
        const savedData = localStorage.getItem(`form-data-${form.id}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field && field.type !== 'file') {
                    field.value = value;
                }
            });
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Custom validation and submission handlers
    function getCustomValidation(form) {
        const validationFn = form.dataset.customValidation;
        return validationFn ? window[validationFn] : null;
    }

    function getFieldValidator(field) {
        const validatorFn = field.dataset.validator;
        return validatorFn ? window[validatorFn] : null;
    }

    function getSubmitHandler(form) {
        const handlerFn = form.dataset.submitHandler;
        return handlerFn ? window[handlerFn] : null;
    }

    // Field-specific setup
    function setupEmailField(field) {
        field.addEventListener('input', () => {
            const value = field.value.trim();
            if (value && !isValidEmail(value)) {
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
        });
    }

    function setupPhoneField(field) {
        field.addEventListener('input', (e) => {
            // Auto-format phone number
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }

    function setupDateField(field) {
        // Set min date to today if not specified
        if (!field.hasAttribute('min')) {
            field.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
    }

    // Initialize custom form elements
    function initializeCustomElements() {
        initializeCustomSelects();
        initializeCustomCheckboxes();
        initializeCustomRadios();
    }

    function initializeCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        customSelects.forEach(select => {
            // Custom select implementation would go here
        });
    }

    function initializeCustomCheckboxes() {
        const customCheckboxes = document.querySelectorAll('.custom-checkbox');
        customCheckboxes.forEach(checkbox => {
            // Custom checkbox implementation would go here
        });
    }

    function initializeCustomRadios() {
        const customRadios = document.querySelectorAll('.custom-radio');
        customRadios.forEach(radio => {
            // Custom radio implementation would go here
        });
    }

    // Public API
    window.marshallairlineForms = {
        validateForm,
        validateField,
        submitForm,
        showFieldError,
        clearFieldError,
        saveFormData,
        loadFormData,
        config
    };

})();