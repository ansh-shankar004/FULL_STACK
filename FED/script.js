document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

// Header scroll effect
const header = document.getElementById('main-header');
const navLinks = document.querySelectorAll('header nav a'); // Get all nav links

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        // Change links to gray when scrolled
        navLinks.forEach(link => {
            link.classList.remove('text-white');
            link.classList.add('text-gray-600');
        });
    } else {
        header.classList.remove('scrolled');
        // Change links back to white when at the top
        navLinks.forEach(link => {
            link.classList.remove('text-gray-600');
            link.classList.add('text-white');
        });
    }
});

    // Hero slider

    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // Fade-in on scroll

    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    // Populate time slots for reservation

    const timeSelect = document.getElementById('time');
    if (timeSelect) {
        const startTime = 11 * 60; // 11:00 AM in minutes
        const endTime = 22 * 60 + 45; // 10:45 PM in minutes
        for (let i = startTime; i <= endTime; i += 15) {
            const hours = Math.floor(i / 60);
            const minutes = i % 60;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;
            const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
            const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
            
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }

    // Reservation form handling

    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        const formMessage = document.getElementById('form-message');
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formMessage.textContent = 'Checking availability...';
            formMessage.className = 'mt-4 text-center font-medium text-primary-gold';

            // Collect form data

            const name = document.getElementById('name').value;
            const mobile = document.getElementById('mobile').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const duration = document.getElementById('duration').value;

            const reservationData = { name, mobile, date, time, guests, duration };
            const jsonData = JSON.stringify(reservationData, null, 2);
            
            // Log JSON data to the console

            console.log("New Reservation Request (JSON):");
            console.log(jsonData);

            setTimeout(() => {
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    formMessage.textContent = 'Table available! Your reservation request has been received. We will call you shortly to confirm.';
                    formMessage.className = 'mt-4 text-center font-medium text-green-600';
                    reservationForm.reset();
                    dateInput.setAttribute('min', today);
                } else {
                    formMessage.textContent = 'Sorry, no tables are available at that time. Please try another slot.';
                    formMessage.className = 'mt-4 text-center font-medium text-red-600';
                }
            }, 1500);
        });
    }

    // Event Quote Estimator Logic
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        const quoteResultDiv = document.getElementById('quote-result');
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const guests = parseInt(document.getElementById('guests-quote').value, 10);
            const hours = parseInt(document.getElementById('duration-quote').value, 10);
            const eventType = document.getElementById('event-type').value;
            const mealType = document.getElementById('meal-type').value;

            if (isNaN(guests) || isNaN(hours) || guests <= 0 || hours <= 0) {
                quoteResultDiv.innerHTML = `<p class="text-red-600 font-medium">Please enter a valid number of guests and duration.</p>`;
                quoteResultDiv.style.opacity = '1';
                return;
            }

            let rate = 0;
            switch (mealType) {
                case 'Veg': rate = 700; break;
                case 'Non-Veg': rate = 800; break;
                case 'Mixed': rate = 900; break;
            }

            let totalCost = guests * rate;
            let discountApplied = false;
            if (eventType === 'Corporate Dinner' && totalCost > 25000) {
                totalCost *= 0.90; // 10% discount
                discountApplied = true;
            }
            
            const formattedCost = totalCost.toLocaleString('en-IN', {
                style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0,
            });

            let resultHTML = `
                <p class="text-lg text-gray-600">Thank you for planning with Kuber Classic!</p>
                <p class="text-gray-800 mt-2">Your estimated event cost is:</p>
                <p class="text-4xl font-serif font-bold text-primary-gold mt-2">${formattedCost}</p>
            `;

            if (discountApplied) {
                resultHTML += `<p class="text-sm text-green-600 mt-2">(A 10% corporate discount has been applied!)</p>`;
            }

            quoteResultDiv.innerHTML = resultHTML;
            quoteResultDiv.style.opacity = '1';
        });
    }

    // Testimonial Carousel Logic
    const track = document.querySelector('.testimonial-carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('next-testimonial');
        const prevButton = document.getElementById('prev-testimonial');
        let currentIndex = 0;
        let intervalId;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            currentIndex = targetIndex;
        };

        const startAutoPlay = () => {
            intervalId = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 5000); // Change slide every 5 seconds
        };

        const stopAutoPlay = () => {
            clearInterval(intervalId);
        };

        nextButton.addEventListener('click', () => {
            stopAutoPlay();
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
            startAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            stopAutoPlay();
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
            startAutoPlay();
        });

        startAutoPlay();
    }
});
