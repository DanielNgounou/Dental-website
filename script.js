/* SERVICES INTERACTION */
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        const isOpen = card.classList.contains("active");

        serviceCards.forEach(item => item.classList.remove("active"));

        if (!isOpen) {
            card.classList.add("active");
        }
    });
});


/* APPOINTMENT TYPE SELECTION */
const typeCards = document.querySelectorAll(".type-card");

typeCards.forEach(card => {
    card.addEventListener("click", () => {
        typeCards.forEach(item => item.classList.remove("active"));
        card.classList.add("active");
    });
});


/* TIME SELECTION */
const timeButtons = document.querySelectorAll(".time-btn");

timeButtons.forEach(button => {
    button.addEventListener("click", () => {
        timeButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    });
});


/* CALENDAR */
const datesContainer = document.querySelector("#datesContainer");
const selectedDateText = document.querySelector(".selected-date");
const monthTitle = document.querySelector("#monthTitle");

const prevWeekBtn = document.querySelector("#prevWeek");
const nextWeekBtn = document.querySelector("#nextWeek");

const today = new Date();

let currentStartDate = new Date(today);
currentStartDate.setDate(today.getDate() - today.getDay());

let selectedDate = getNextAvailableDate(today);

const dayShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const dayLong = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const monthLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function sameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function updateSelectedDateText(date) {
    selectedDateText.textContent =
        `${dayLong[date.getDay()]}, ${date.getDate()} ${monthLong[date.getMonth()]} ${date.getFullYear()}`;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function getNextAvailableDate(date) {
    const nextDate = new Date(date);

    while (isWeekend(nextDate)) {
        nextDate.setDate(nextDate.getDate() + 1);
    }

    return nextDate;
}

function renderDates() {
    datesContainer.innerHTML = "";

    monthTitle.textContent =
        `${monthLong[currentStartDate.getMonth()]} ${currentStartDate.getFullYear()}`;

    for (let i = 0; i < 7; i++) {
        const date = new Date(currentStartDate);
        date.setDate(currentStartDate.getDate() + i);

        const button = document.createElement("button");
        button.classList.add("date-card");

        const day = date.getDay();
        const isWeekend = day === 0 || day === 6;

        const isPast =
            date < new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );

        if (isWeekend || isPast) {
            button.classList.add("disabled");
        }
        if (sameDay(date, selectedDate)) {
            button.classList.add("active");
        }

        button.innerHTML = `
            <span>${dayShort[day]}</span>
            <strong>${date.getDate()}</strong>
        `;

        if (!button.classList.contains("disabled")) {
            button.addEventListener("click", () => {
                selectedDate = new Date(date);
                updateSelectedDateText(selectedDate);
                renderDates();
            });
        }

        datesContainer.appendChild(button);
    }

    updateSelectedDateText(selectedDate);
}

prevWeekBtn.addEventListener("click", () => {
    currentStartDate.setDate(currentStartDate.getDate() - 7);
    renderDates();
});

nextWeekBtn.addEventListener("click", () => {
    currentStartDate.setDate(currentStartDate.getDate() + 7);
    renderDates();
});

renderDates();


/* FORM INPUT VALIDATION */
const birthDateInput = document.querySelector("#birthDate");
const phoneInput = document.querySelector("#cell");

birthDateInput.max = new Date().toISOString().split("T")[0];

phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9()+\-\s]/g, "");
});


/* MULTI-STEP BOOKING FLOW */
const stepAppointment = document.querySelector("#stepAppointment");
const stepPatientInfo = document.querySelector("#stepPatientInfo");
const stepReview = document.querySelector("#stepReview");

const appointmentNextBtn = document.querySelector("#appointmentNextBtn");
const patientInfoPreviousBtn = document.querySelector("#patientInfoPreviousBtn");
const patientInfoNextBtn = document.querySelector("#patientInfoNextBtn");
const reviewPreviousBtn = document.querySelector("#reviewPreviousBtn");
const confirmAppointmentBtn = document.querySelector("#confirmAppointmentBtn");

const progressSteps = document.querySelectorAll(".step");

function showStep(stepNumber) {
    stepAppointment.classList.remove("active");
    stepPatientInfo.classList.remove("active");
    stepReview.classList.remove("active");

    progressSteps.forEach(step => step.classList.remove("active"));

    if (stepNumber === 1) {
        stepAppointment.classList.add("active");
        progressSteps[0].classList.add("active");
    }

    if (stepNumber === 2) {
        stepPatientInfo.classList.add("active");
        progressSteps[1].classList.add("active");
    }

    if (stepNumber === 3) {
        stepReview.classList.add("active");
        progressSteps[2].classList.add("active");
    }
}

appointmentNextBtn.addEventListener("click", () => {
    showStep(2);
});

patientInfoPreviousBtn.addEventListener("click", () => {
    showStep(1);
});

const patientForm = document.querySelector(".patient-form");

patientInfoNextBtn.addEventListener("click", () => {
    if (!patientForm.checkValidity()) {
        patientForm.reportValidity();
        return;
    }

    fillReview();
    showStep(3);
});

reviewPreviousBtn.addEventListener("click", () => {
    showStep(2);
});


/* REVIEW SUMMARY */
function fillReview() {
    const selectedType = document.querySelector(".type-card.active");
    const selectedTime = document.querySelector(".time-btn.active");

    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const birthDate = document.querySelector("#birthDate").value;
    const cell = document.querySelector("#cell").value;
    const email = document.querySelector("#email").value;
    const notes = document.querySelector("#notes").value;

    document.querySelector("#reviewType").textContent =
        selectedType ? selectedType.innerText : "Not selected";

    document.querySelector("#reviewDate").textContent =
        selectedDateText.textContent;

    document.querySelector("#reviewTime").textContent =
        selectedTime ? selectedTime.innerText : "Not selected";

    document.querySelector("#reviewName").textContent =
        `${firstName || "Not provided"} ${lastName || ""}`;

    document.querySelector("#reviewBirthDate").textContent =
        birthDate || "Not provided";

    document.querySelector("#reviewCell").textContent =
        cell || "Not provided";

    document.querySelector("#reviewEmail").textContent =
        email || "Not provided";

    document.querySelector("#reviewNotes").textContent =
        notes || "No notes";
}


/* CONFIRMATION */
confirmAppointmentBtn.addEventListener("click", () => {
    alert("Your appointment request has been submitted successfully.");
});