// Form Logic with Image Upload
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("form-container");
    if(container) buildForm(container);
});

function buildForm(container) {
    const formBox = document.createElement("div");
    formBox.className = "form-box glassmorphism scale-in";

    const title = document.createElement("h2");
    title.innerText = "Contribute a City";
    formBox.appendChild(title);

    const description = document.createElement("p");
    description.innerText = "Add your favorite location. Upload a photo to be featured!";
    formBox.appendChild(description);

    const form = document.createElement("form");
    form.id = "addCityForm";

    const createInputGroup = (labelText, type, id, placeholder) => {
        const group = document.createElement("div");
        group.className = "input-group";
        
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = labelText;

        const input = document.createElement(type === "textarea" ? "textarea" : "input");
        if (type !== "textarea") input.setAttribute("type", type);
        input.id = id; input.name = id;
        if(placeholder) input.setAttribute("placeholder", placeholder);
        
        const error = document.createElement("span");
        error.className = "error-message";
        error.id = id + "-error";

        group.appendChild(label);
        group.appendChild(input);
        group.appendChild(error);
        return { group, input, error };
    };

    const createSelectGroup = (labelText, id, optionsObj) => {
        const group = document.createElement("div");
        group.className = "input-group";
        
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = labelText;

        const select = document.createElement("select");
        select.id = id; select.name = id;
        
        const defaultOpt = document.createElement("option");
        defaultOpt.value = ""; defaultOpt.innerText = "Select a Category";
        select.appendChild(defaultOpt);

        for (const [val, text] of Object.entries(optionsObj)) {
            const opt = document.createElement("option");
            opt.value = val; opt.innerText = text;
            select.appendChild(opt);
        }

        const error = document.createElement("span");
        error.className = "error-message"; error.id = id + "-error";

        group.appendChild(label);
        group.appendChild(select);
        group.appendChild(error);
        return { group, input: select, error };
    }

    const categoryOptions = {
        'historic': 'Historic Places',
        'food': 'Foods & Cuisines',
        'festivals': 'Local Festivals',
        'wonders': 'Natural Wonders', // Updated category tag
        'museums': 'Museums & Art',
        'hidden': 'Hidden Gems'
    };

    // Form inputs creation
    const nameGroup = createInputGroup("Your Name", "text", "authorName", "e.g. John Doe");
    const cityNameGroup = createInputGroup("City Name", "text", "cityName", "e.g. Kyoto");
    const locationGroup = createInputGroup("Location/Country", "text", "location", "e.g. Japan");
    const budgetGroup = createInputGroup("Estimated Budget", "text", "budget", "e.g. $150/day");
    const categoryGroup = createSelectGroup("Category", "cityCategory", categoryOptions);
    const historyGroup = createInputGroup("Brief History", "textarea", "history", "A little history about this place...");
    const recipesGroup = createInputGroup("Local Foods / Recipes", "textarea", "recipes", "Must try local foods");
    const detailsGroup = createInputGroup("Overview Description", "textarea", "details", "What makes this place special?");
    
    // Set required attributes
    nameGroup.input.required = true;
    cityNameGroup.input.required = true;
    locationGroup.input.required = true;
    budgetGroup.input.required = true;
    categoryGroup.input.required = true;
    detailsGroup.input.required = true;
    
    // File input
    const imageGroup = createInputGroup("Upload Cover Image", "file", "cityImage", "");
    imageGroup.input.setAttribute("accept", "image/*");

    // Image Preview
    const imagePreviewContainer = document.createElement("div");
    imagePreviewContainer.className = "input-group";
    imagePreviewContainer.innerHTML = `
        <label>Image Preview</label>
        <img id="image-preview" src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Picture Not Available" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 2px dashed #ccc; padding: 5px;">
    `;

    imageGroup.input.addEventListener("change", function() {
        const file = this.files[0];
        const previewEl = document.getElementById("image-preview");
        if(file && previewEl) {
            const reader = new FileReader();
            reader.onload = function(e) { previewEl.src = e.target.result; };
            reader.readAsDataURL(file);
        } else if (previewEl) {
            previewEl.src = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
        }
    });

    form.appendChild(nameGroup.group);
    form.appendChild(cityNameGroup.group);
    form.appendChild(locationGroup.group);
    form.appendChild(budgetGroup.group);
    form.appendChild(categoryGroup.group);
    form.appendChild(historyGroup.group);
    form.appendChild(recipesGroup.group);
    form.appendChild(detailsGroup.group);
    form.appendChild(imageGroup.group);
    form.appendChild(imagePreviewContainer);

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-large w-100";
    submitBtn.innerText = "Save Location";
    form.appendChild(submitBtn);

    const statusMsg = document.createElement("div");
    statusMsg.className = "status-message";
    form.appendChild(statusMsg);

    formBox.appendChild(form);
    container.appendChild(formBox);

    // Save Logic
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        document.querySelectorAll(".error-message").forEach(el => el.innerText = "");
        statusMsg.innerText = "";
        
        let isValid = true;
        
        const author = nameGroup.input.value.trim();
        const city = cityNameGroup.input.value.trim();
        const category = categoryGroup.input.value;
        const details = detailsGroup.input.value.trim();
        const reqLocation = locationGroup.input.value.trim();
        const reqBudget = budgetGroup.input.value.trim();

        if (!author.match(/^[a-zA-Z ]+$/)) { 
            nameGroup.error.innerText = "Please enter a valid name"; 
            isValid = false; 
        }
        if (!city.match(/^[a-zA-Z ]+$/)) { 
            cityNameGroup.error.innerText = "Please enter a valid city name"; 
            isValid = false; 
        }
        if (!category) { 
            categoryGroup.error.innerText = "Select a category"; 
            isValid = false; 
        }
        if (!reqLocation.match(/^[a-zA-Z, ]+$/)) { 
            locationGroup.error.innerText = "Please enter a valid location"; 
            isValid = false; 
        }
        if (!reqBudget) { 
            budgetGroup.error.innerText = "Estimate a budget"; 
            isValid = false; 
        }
        if (details.length < 10) { 
            detailsGroup.error.innerText = "Provide more detail (min 10 chars)"; 
            isValid = false; 
        }

        if (isValid) {
            submitBtn.innerText = "Uploading Image & Saving...";
            submitBtn.disabled = true;

            const handleSave = (base64Img) => {
                const newCity = {
                    name: city,
                    location: reqLocation,
                    budget: reqBudget,
                    history: historyGroup.input.value.trim(),
                    recipes: recipesGroup.input.value.trim(),
                    details: details,
                    category: category,
                    author: author,
                    image: base64Img
                };

                const storage = localStorage.getItem("userAdditions");
                let arr = storage ? JSON.parse(storage) : [];
                arr.push(newCity);
                localStorage.setItem("userAdditions", JSON.stringify(arr));

                statusMsg.innerText = `Successfully Saved! View the '${categoryOptions[category]}' tab.`;
                statusMsg.classList.add("success");
                form.reset();
                submitBtn.innerText = "Save Location";
                submitBtn.disabled = false;
            };

            const file = imageGroup.input.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onloadend = () => { handleSave(reader.result); };
                reader.readAsDataURL(file);
            } else {
                handleSave(""); // Save without image
            }
        } else {
             formBox.classList.add("shake-error");
             setTimeout(() => formBox.classList.remove("shake-error"), 500);
        }
    });
}
