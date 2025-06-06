let userForm = document.getElementById("user_form");

const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);
    } else {
        entries = [];
    }
    return entries;
}

let userEntries = retrieveEntries();

const displayEntries = () => {
    const entries = retrieveEntries();

    const tableEntries = entries.map((entry) => {
        const nameCell = `<td>${entry.name}</td>`;
        const emailCell = `<td>${entry.email}</td>`;
        const passwordCell = `<td>${entry.password}</td>`;
        const dobCell = `<td>${entry.dob}</td>`;
        const termsCell = `<td>${entry.terms}</td>`;

        const row = `<tr>${nameCell}${emailCell}${passwordCell}${dobCell}${termsCell}</tr>`;
        return row;
    }).join('\n');

    const table = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr style="background-color: #f9fafb; text-align: left;">
                <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Password</th>
                <th style="border: 1px solid #ddd; padding: 8px;">dob</th>
                <th style="border: 1px solid #ddd; padding: 8px;">accepted terms?</th>
            </tr>
        </thead>
        <tbody>
            ${tableEntries}
        </tbody>
    </table>`;

    const details = document.getElementById("user-entries");
    details.innerHTML = table;
};


window.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dob");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // Max: 18 years ago from today
    const max = `${yyyy - 18}-${mm}-${dd}`;
    // Min: 55 years ago from today
    const min = `${yyyy - 55}-${mm}-${dd}`;
    dobInput.setAttribute("min", min);
    dobInput.setAttribute("max", max);
});

const saveUserForm = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dobInput = document.getElementById("dob");
    const dob = dobInput.value;
    const terms = document.getElementById("terms").checked;

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

    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));
    displayEntries();
}
userForm.addEventListener("submit", saveUserForm);
displayEntries();
