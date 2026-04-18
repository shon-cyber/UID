document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type') || 'historic';
    
    // Set Header
    const titleDict = {
        'historic': 'Historic Places',
        'food': 'Foods & Cuisines',
        'festivals': 'Local Festivals',
        'wonders': 'Natural Wonders',
        'museums': 'Museums & Art',
        'hidden': 'Hidden Gems'
    };

    const titleEl = document.getElementById("pageTitle");
    if(titleEl) titleEl.innerText = titleDict[categoryType] || "Places";

    // Build the grid
    const container = document.getElementById("cityList");
    if(!container) return;

    // Load static data
    let itemsToDisplay = window.initialData[categoryType] || [];

    // Load LocalStorage submissions
    const stored = localStorage.getItem("userAdditions");
    if(stored) {
        try {
            const userCities = JSON.parse(stored);
            // filter dynamically added cities by the current category
            const relevant = userCities.filter(c => c.category === categoryType);
            itemsToDisplay = [...itemsToDisplay, ...relevant];
        } catch (e) {
            console.error("Local storage processing error:", e);
        }
    }

    if(itemsToDisplay.length === 0) {
        container.innerHTML = `<p class="empty-state">No cities found for this category yet!</p>`;
        return;
    }

    // Modal References
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalClose = document.getElementById("modalClose");
    
    // Close Modal Logic
    if(modalClose) {
        modalClose.onclick = () => { modalBackdrop.classList.remove('active'); }
        modalBackdrop.onclick = (e) => {
            if(e.target === modalBackdrop) modalBackdrop.classList.remove('active');
        }
    }

    // Render cards
    itemsToDisplay.forEach((city, index) => {
        const delayClass = (index % 3) === 1 ? 'delay-1' : (index % 3) === 2 ? 'delay-2' : '';
        
        const card = document.createElement("div");
        card.className = `card detail-card fade-up ${delayClass}`;
        
        // Provide a default image string if none uploaded
        const bgImage = city.image || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
        
        card.innerHTML = `
            <div class="card-icon" style="background-image: url('${bgImage}')"></div>
            <div class="card-content">
                <h3>${city.name}</h3>
                <p class="description">${city.details.substring(0, 50)}...</p>
                <div class="click-more">Click to view deep details →</div>
                <p class="author">Submitted by: <strong>${city.author}</strong></p>
            </div>
        `;

        // Click Logic opens modal
        card.addEventListener('click', () => {
            document.getElementById("modalTitle").innerText = city.name;
            document.getElementById("modalImg").src = bgImage;
            document.getElementById("modalLocation").innerText = "📍 " + (city.location || "Unknown");
            document.getElementById("modalBudget").innerText = "💰 " + (city.budget || "TBD");
            document.getElementById("modalHistory").innerText = city.history || "No historical information provided.";
            document.getElementById("modalRecipes").innerText = city.recipes || "No culinary information provided.";
            document.getElementById("modalDetails").innerText = city.details;
            document.getElementById("modalAuthor").innerText = "Submitted by: " + city.author;
            
            modalBackdrop.classList.add("active");
        });

        container.appendChild(card);
    });
});
