// Nordic Smart Building App JavaScript with Norwegian Kroner and Language Support

// Application data with Norwegian Kroner and translations
const appData = {
  building_data: {
    current_temperature: {
      indoor: 21.5,
      outdoor: 2.8,
      target: 22.0
    },
    energy_consumption: {
      today_kwh: 12.4,
      yesterday_kwh: 15.2,
      weekly_average: 14.1,
      monthly_total: 394.2
    },
    electricity_prices: {
      current_rate: 2.45,
      next_hour: 2.12,
      peak_hours: ["17:00", "18:00", "19:00"],
      off_peak_hours: ["02:00", "03:00", "04:00", "05:00"]
    },
    pcm_floor_status: {
      temperature: 23.1,
      charging_phase: "optimal",
      efficiency: 87,
      next_optimal_heating: "02:30"
    }
  },
  user_preferences: {
    comfort_temperature: 22,
    schedule: {
      wake_up: "07:00",
      leave_home: "08:30",
      return_home: "17:00",
      sleep: "23:00"
    },
    priority: "balanced",
    notifications: true
  },
  recommendations: [
    {
      type: "heating",
      message_en: "Pre-heat floor at 2:30 AM when electricity is 35% cheaper",
      message_no: "Forvarm gulvet kl. 02:30 når strømmen er 35% billigere",
      savings_nok: 28.50,
      impact: "Low"
    },
    {
      type: "temperature",
      message_en: "Lower temperature by 1°C during away hours",
      message_no: "Senk temperaturen med 1°C når du er borte",
      savings_nok: 15.80,
      impact: "None"
    },
    {
      type: "schedule",
      message_en: "Optimize heating schedule based on weather forecast",
      message_no: "Optimaliser varmeplan basert på værmelding",
      savings_nok: 18.70,
      impact: "Low"
    }
  ],
  historical_data: {
    weekly_savings_nok: [110.4, 135.2, 167.8, 195.1, 175.8, 225.3, 258.9],
    weekly_consumption: [45.2, 42.1, 38.9, 35.6, 33.2, 31.8, 29.4],
    comfort_score: [8.5, 8.7, 9.1, 9.2, 9.0, 9.3, 9.4]
  },
  weather_forecast: {
    today: {
      high: 5,
      low: -2,
      condition: "snow"
    },
    tomorrow: {
      high: 7,
      low: 1,
      condition: "cloudy"
    }
  },
  translations: {
    app_title: {
      en: "Smart Building",
      no: "Smart Bygg"
    },
    dashboard: {
      en: "Dashboard",
      no: "Oversikt"
    },
    energy_monitor: {
      en: "Energy Monitor",
      no: "Energimonitor"
    },
    heating_control: {
      en: "Heating Control",
      no: "Varmestyring"
    },
    recommendations: {
      en: "Recommendations",
      no: "Anbefalinger"
    },
    settings: {
      en: "Settings",
      no: "Innstillinger"
    },
    indoor_temperature: {
      en: "Indoor Temperature",
      no: "Innendørs temperatur"
    },
    energy_usage: {
      en: "Today's Usage",
      no: "Dagens forbruk"
    },
    daily_savings: {
      en: "Daily Savings",
      no: "Daglig besparelse"
    },
    pcm_floor: {
      en: "PCM Floor Status",
      no: "PCM gulvstatus"
    },
    target: {
      en: "Target",
      no: "Mål"
    },
    vs_yesterday: {
      en: "vs yesterday",
      no: "vs i går"
    },
    efficiency: {
      en: "Efficiency",
      no: "Effektivitet"
    },
    current_rate: {
      en: "Current Rate",
      no: "Gjeldende pris"
    },
    next_hour: {
      en: "Next Hour",
      no: "Neste time"
    }
  }
};

// Current state
let currentTargetTemp = appData.user_preferences.comfort_temperature;
let currentLanguage = 'en';
let energyChart = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nordic Smart Building App initializing...');
    initializeApp();
});

function initializeApp() {
    updateCurrentTime();
    setupTemperatureControls();
    setupModeButtons();
    setupRecommendations();
    setupSettings();
    setupNavigation();
    updateLanguage();
    
    // Create chart after a short delay to ensure DOM is ready
    setTimeout(() => {
        createEnergyChart();
    }, 500);
    
    // Update time every minute
    setInterval(updateCurrentTime, 60000);
    
    console.log('Nordic Smart Building App initialized successfully');
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                // Extract section name from onclick attribute
                const match = onclick.match(/showSection\('([^']+)'\)/);
                if (match) {
                    showSection(match[1]);
                }
            }
        });
    });
}

// Global navigation function
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the correct nav button
    const activeNavButton = Array.from(navItems).find(item => {
        const onclick = item.getAttribute('onclick');
        return onclick && onclick.includes(`'${sectionId}'`);
    });
    
    if (activeNavButton) {
        activeNavButton.classList.add('active');
    }
    
    // Initialize section-specific content
    if (sectionId === 'energy' && !energyChart) {
        setTimeout(createEnergyChart, 100);
    }
}

// Make showSection globally available
window.showSection = showSection;

// Language switching functionality
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'no' : 'en';
    updateLanguage();
    
    // Update chart if it exists
    if (energyChart) {
        createEnergyChart();
    }
    
    showNotification(
        currentLanguage === 'en' ? 
        'Language switched to English' : 
        'Språk endret til norsk'
    );
}

// Make toggleLanguage globally available
window.toggleLanguage = toggleLanguage;

function updateLanguage() {
    const langFlag = document.getElementById('currentLang');
    if (langFlag) {
        langFlag.textContent = currentLanguage === 'en' ? '🇬🇧' : '🇳🇴';
    }
    
    // Update all elements with data-text attributes
    const elementsToTranslate = document.querySelectorAll('[data-text]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-text');
        if (appData.translations[key] && appData.translations[key][currentLanguage]) {
            element.textContent = appData.translations[key][currentLanguage];
        }
    });
    
    // Update recommendation messages
    const recMessages = document.querySelectorAll('.rec-message');
    recMessages.forEach((message, index) => {
        const enMessage = message.getAttribute('data-message-en');
        const noMessage = message.getAttribute('data-message-no');
        if (enMessage && noMessage) {
            message.textContent = currentLanguage === 'en' ? enMessage : noMessage;
        }
    });
}

// Update current time with Norwegian format
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(currentLanguage === 'no' ? 'nb-NO' : 'en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Create energy consumption chart with Norwegian Kroner
function createEnergyChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx) {
        console.log('Chart canvas not found');
        return;
    }
    
    console.log('Creating Nordic energy chart...');
    
    if (energyChart) {
        energyChart.destroy();
    }
    
    const days = currentLanguage === 'en' ? 
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
    
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: currentLanguage === 'en' ? 'Energy Consumption (kWh)' : 'Energiforbruk (kWh)',
                    data: appData.historical_data.weekly_consumption,
                    borderColor: '#3498DB',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3498DB',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: currentLanguage === 'en' ? 'Savings (kr)' : 'Besparelser (kr)',
                    data: appData.historical_data.weekly_savings_nok,
                    borderColor: '#27AE60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#27AE60',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        color: '#2C3E50'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(139, 157, 195, 0.15)'
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: 'Inter'
                        },
                        color: '#8B9DC3'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(139, 157, 195, 0.15)'
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: 'Inter'
                        },
                        color: '#8B9DC3'
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
    
    console.log('Nordic energy chart created successfully');
}

// Temperature control functionality
function setupTemperatureControls() {
    updateTemperatureDisplay();
    
    // Setup temperature buttons
    const tempButtons = document.querySelectorAll('.temp-btn');
    tempButtons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (onclick.includes('-1')) {
                    adjustTemperature(-1);
                } else if (onclick.includes('1')) {
                    adjustTemperature(1);
                }
            });
        }
    });
}

// Temperature adjustment function
function adjustTemperature(change) {
    currentTargetTemp += change;
    currentTargetTemp = Math.max(16, Math.min(28, currentTargetTemp));
    updateTemperatureDisplay();
    
    // Simulate updating the system
    const message = currentLanguage === 'en' ? 
        `Temperature set to ${currentTargetTemp}°C` :
        `Temperatur satt til ${currentTargetTemp}°C`;
    showNotification(message);
}

// Make adjustTemperature globally available
window.adjustTemperature = adjustTemperature;

function updateTemperatureDisplay() {
    const tempDisplay = document.getElementById('targetTemp');
    if (tempDisplay) {
        tempDisplay.textContent = currentTargetTemp;
    }
}

// Mode button functionality
function setupModeButtons() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            modeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const mode = this.getAttribute('data-mode');
            handleModeChange(mode);
        });
    });
}

function handleModeChange(mode) {
    let message = '';
    let newTemp = currentTargetTemp;
    
    switch(mode) {
        case 'comfort':
            newTemp = 22;
            message = currentLanguage === 'en' ? 
                'Comfort mode activated - prioritizing optimal temperature' :
                'Komfortmodus aktivert - prioriterer optimal temperatur';
            break;
        case 'eco':
            newTemp = 20;
            message = currentLanguage === 'en' ? 
                'Eco mode activated - optimizing for energy savings' :
                'Øko-modus aktivert - optimerer for energisparing';
            break;
        case 'away':
            newTemp = 18;
            message = currentLanguage === 'en' ? 
                'Away mode activated - minimal heating while away' :
                'Borte-modus aktivert - minimal oppvarming når borte';
            break;
    }
    
    currentTargetTemp = newTemp;
    updateTemperatureDisplay();
    showNotification(message);
}

// Recommendations functionality
function setupRecommendations() {
    const recommendationButtons = document.querySelectorAll('.rec-action');
    
    recommendationButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            applyRecommendation(index, this);
        });
    });
}

function applyRecommendation(index, button) {
    const rec = appData.recommendations[index];
    if (rec) {
        const buttonText = currentLanguage === 'en' ? 'Applied' : 'Brukt';
        button.textContent = buttonText;
        button.disabled = true;
        button.style.opacity = '0.6';
        
        const message = currentLanguage === 'en' ? 
            `${rec.message_en}. Daily savings: ${rec.savings_nok.toFixed(2)} kr` :
            `${rec.message_no}. Daglig besparelse: ${rec.savings_nok.toFixed(2)} kr`;
        
        showNotification(message);
    }
}

// Settings functionality
function setupSettings() {
    const prioritySelect = document.getElementById('priorityMode');
    if (prioritySelect) {
        prioritySelect.addEventListener('change', function(e) {
            const priority = e.target.value;
            appData.user_preferences.priority = priority;
            
            let priorityText = '';
            if (currentLanguage === 'en') {
                switch(priority) {
                    case 'comfort':
                        priorityText = 'Comfort First';
                        break;
                    case 'balanced':
                        priorityText = 'Balanced';
                        break;
                    case 'savings':
                        priorityText = 'Savings First';
                        break;
                }
            } else {
                switch(priority) {
                    case 'comfort':
                        priorityText = 'Komfort først';
                        break;
                    case 'balanced':
                        priorityText = 'Balansert';
                        break;
                    case 'savings':
                        priorityText = 'Besparelser først';
                        break;
                }
            }
            
            const message = currentLanguage === 'en' ? 
                `Priority mode changed to ${priorityText}` :
                `Prioritetsmodus endret til ${priorityText}`;
            
            showNotification(message);
        });
    }
}

// Enhanced notification system with Nordic styling
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #3498DB, #2980B9);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1001;
        max-width: 320px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Fade in with slide effect
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Format Norwegian Kroner values
function formatNOK(amount) {
    return new Intl.NumberFormat(currentLanguage === 'no' ? 'nb-NO' : 'en-US', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 2
    }).format(amount).replace('NOK', 'kr');
}

// Utility functions for data updates
function updateDashboardData() {
    // Simulate real-time data updates with Norwegian conditions
    const variations = {
        indoor_temp: (Math.random() - 0.5) * 0.3,
        energy_today: (Math.random() - 0.5) * 0.8,
        savings: (Math.random() - 0.5) * 15.0
    };
    
    // Update values with small variations
    appData.building_data.current_temperature.indoor += variations.indoor_temp;
    appData.building_data.energy_consumption.today_kwh += variations.energy_today;
    
    // Keep values within realistic ranges for Norwegian climate
    appData.building_data.current_temperature.indoor = Math.max(18, Math.min(26, appData.building_data.current_temperature.indoor));
    appData.building_data.energy_consumption.today_kwh = Math.max(8, Math.min(25, appData.building_data.energy_consumption.today_kwh));
}

// Simulate periodic data updates
setInterval(() => {
    updateDashboardData();
}, 45000); // Update every 45 seconds

// Handle window resize for chart responsiveness
window.addEventListener('resize', () => {
    if (energyChart) {
        energyChart.resize();
    }
});

// Enhanced touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 80;
    const verticalThreshold = 100;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > swipeThreshold && diffY < verticalThreshold) {
        const sections = ['dashboard', 'energy', 'heating', 'recommendations', 'settings'];
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return;
        
        const currentIndex = sections.indexOf(activeSection.id);
        
        let newIndex;
        if (diffX > 0) { // Swipe left
            newIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else { // Swipe right
            newIndex = Math.max(currentIndex - 1, 0);
        }
        
        if (newIndex !== currentIndex) {
            showSection(sections[newIndex]);
        }
    }
}

// Weather condition icons for Norwegian weather
function getWeatherIcon(condition) {
    const icons = {
        'snow': '🌨️',
        'cloudy': '☁️',
        'sunny': '☀️',
        'rain': '🌧️',
        'partly-cloudy': '⛅',
        'windy': '💨'
    };
    return icons[condition] || '🌤️';
}

// Export functions for external use
window.NordicSmartBuildingApp = {
    adjustTemperature: adjustTemperature,
    toggleLanguage: toggleLanguage,
    applyRecommendation,
    showNotification,
    updateDashboardData,
    showSection: showSection,
    formatNOK,
    currentLanguage: () => currentLanguage
};

console.log('Nordic Smart Building App with Norwegian Kroner support loaded successfully 🇳🇴');