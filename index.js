let userForm = document.getElementById("user_form");

const retrieveEntries = () => {
    try {
        let entries = localStorage.getItem("user-entries");
        if (entries) {
            entries = JSON.parse(entries);
            console.log("Retrieved entries:", entries); // Debug log
        } else {
            entries = [];
            console.log("No entries in localStorage, initializing empty array");
        }
        return Array.isArray(entries) ? entries : [];
    } catch (e) {
        console.error("Error parsing localStorage entries:", e);
        return [];
    }
};

let userEntries = retrieveEntries();

const displayEntries = () => {
    const entries = retrieveEntries();
    console.log("Displaying entries:", entries); // Debug log

    if (!entries || entries.length === 0) {
        document.getElementById("user-entries").innerHTML = "<p>No entries found.</p>";
        return;
    }

    const tableEntries = entries.map((entry) => {
        const nameCell = `<td style="border: 1px solid #ddd; padding: 8px;">${entry.name || ''}</td>`;
        const emailCell = `<td style="border: 1px solid #ddd; padding: 8px;">${entry.email || ''}</td>`;
        const passwordCell = `<td style="border: 1px solid #ddd; padding: 8px;">${entry.password || ''}</td>`;
        const dobCell = `<td style="border: 1px solid #ddd; padding: 8px;">${entry.dob || ''}</td>`;
        const termsCell = `<td style="border: 1px solid #ddd; padding: 8px;">${entry.terms ? 'Yes' : 'No'}</td>`;
        return `<tr>${nameCell}${emailCell}${passwordCell}${dobCell}${termsCell}</tr>`;
    }).join('');

    const table = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f9fafb;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Password</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Dob</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Accepted terms?</th>
                </tr>
            </thead>
            <tbody>
                ${tableEntries}
            </tbody>
        </table>`;

    const details = document.getElementById("user-entries");
    if (details) {
        details.innerHTML = table;
        console.log("Table updated with entries");
    } else {
        console.error("Element with id 'user-entries' not found");
    }
};

window.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dob");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const max = `${yyyy - 18}-${mm}-${dd}`; // 18 years ago
    const min = `${yyyy - 55}-${mm}-${dd}`; // 55 years ago
    dobInput.setAttribute("min", min);
    dobInput.setAttribute("max", max);
    console.log("DOB input constraints set:", { min, max }); // Debug log
});

const saveUserForm = (event) => {
    event.preventDefault();
    console.log("Form submitted"); // Debug log

    const name = document.getElementById("name").value;
    const emailInput = document.getElementById("email"); // Reference the input element
    const email = emailInput.value; // Get the value separately
    const password = document.getElementById("password").value;
    const dobInput = document.getElementById("dob");
    const dob = dobInput.value;
    const terms = document.getElementById("terms").checked;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailInput.reportValidity();
        console.log("Invalid email:", email);
        return;
    } else {
        emailInput.setCustomValidity("");
    }

    // Calculate age precisely
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }

    if (age < 18 || age > 55) {
        dobInput.setCustomValidity("Age must be between 18 and 55 years.");
        dobInput.reportValidity();
        console.log("Invalid age:", age);
        return;
    } else {
        dobInput.setCustomValidity("");
    }

    const entry = {
        name,
        email,
        password,
        dob,
        terms
    };
    console.log("New entry:", entry); // Debug log

    userEntries.push(entry);
    try {
        localStorage.setItem("user-entries", JSON.stringify(userEntries));
        console.log("Entry saved to localStorage");
    } catch (e) {
        console.error("Error saving to localStorage:", e);
    }
    displayEntries();

};

userForm.addEventListener("submit", saveUserForm);
displayEntries();
