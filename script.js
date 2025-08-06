// JavaScript for Basti ki Pathshala Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFormValidation();
    initSmoothScrolling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('volunteerForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Custom validation for availability checkboxes
            const availabilityCheckboxes = form.querySelectorAll('input[type="checkbox"]:not(#agree)');
            const isAvailabilitySelected = Array.from(availabilityCheckboxes).some(cb => cb.checked);
            
            // Remove previous custom validation messages
            removeCustomValidationMessages();
            
            if (!isAvailabilitySelected) {
                showCustomValidationMessage('availability', 'Please select at least one availability option.');
                return;
            }
            
            // Bootstrap validation
            if (form.checkValidity()) {
                submitForm(form);
            } else {
                form.classList.add('was-validated');
                
                // Focus on first invalid field
                const firstInvalidField = form.querySelector(':invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 10) {
                    value = value.substring(0, 10);
                }
                e.target.value = value;
            });
        }
    }
}

// Custom validation messages
function showCustomValidationMessage(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    if (!field) return;
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'invalid-feedback custom-validation';
    feedbackDiv.textContent = message;
    feedbackDiv.style.display = 'block';
    
    if (fieldName === 'availability') {
        const availabilitySection = document.querySelector('input[type="checkbox"]').closest('.col-12');
        availabilitySection.appendChild(feedbackDiv);
    } else {
        field.parentNode.appendChild(feedbackDiv);
    }
    
    field.classList.add('is-invalid');
}

function removeCustomValidationMessages() {
    const customMessages = document.querySelectorAll('.custom-validation');
    customMessages.forEach(msg => msg.remove());
}

// Form submission
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    
    // Collect form data
    const formData = new FormData(form);
    const volunteerData = {};
    
    // Basic form fields
    for (let [key, value] of formData.entries()) {
        volunteerData[key] = value;
    }
    
    // Collect availability options
    const availabilityOptions = [];
    const availabilityCheckboxes = form.querySelectorAll('input[type="checkbox"]:not(#agree)');
    availabilityCheckboxes.forEach(cb => {
        if (cb.checked) {
            availabilityOptions.push(cb.value);
        }
    });
    volunteerData.availability = availabilityOptions;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Volunteer Application Data:', volunteerData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Remove validation classes
        const validatedFields = form.querySelectorAll('.is-valid, .is-invalid');
        validatedFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
    }, 2000);
}

// Success message
function showSuccessMessage() {
    const form = document.getElementById('volunteerForm');
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-4 fade-in-up';
    successAlert.innerHTML = `
        <h5><i class="fas fa-check-circle me-2"></i>Application Submitted Successfully!</h5>
        <p class="mb-0">Thank you for your interest in volunteering with Basti ki Pathshala. We will review your application and contact you within 2-3 business days.</p>
    `;
    
    form.parentNode.insertBefore(successAlert, form.nextSibling);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        successAlert.remove();
    }, 10000);
    
    // Scroll to success message
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .icon-circle, .volunteer-form-container');
    animateElements.forEach(el => observer.observe(el));
    
    // Counter animation for statistics
    animateCounters();
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.icon-circle');
    const speed = 200;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target') || 100;
            const count = +counter.querySelector('.count') || 0;
            
            const inc = target / speed;
            
            if (count < target) {
                counter.querySelector('.count').innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.querySelector('.count').innerText = target;
            }
        };
        
        // Only animate when in view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        if (counter.querySelector('.count')) {
            observer.observe(counter);
        }
    });
}

// Utility functions
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Alt+S
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('#home');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add focus indicators for keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Print functionality
function printPage() {
    window.print();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initFormValidation,
        initSmoothScrolling,
        initAnimations
    };
} 