/* =========================================================
   SAVORÉ — MAIN JAVASCRIPT
   Complete interactive functionality
   ========================================================= */

"use strict";


/* =========================================================
   01. MOBILE NAVIGATION
   ========================================================= */

const mobileNavigation = document.querySelector(
    "#mobile-navigation"
);

const menuToggle = document.querySelector(
    ".menu-toggle"
);

const menuClose = document.querySelector(
    ".menu-close"
);

const mobileNavigationLinks = document.querySelectorAll(
    ".mobile-nav a"
);

const mobileReservationLink = document.querySelector(
    ".mobile-navigation-footer a"
);


/**
 * Open the mobile navigation menu.
 */
function openMobileMenu() {
    if (!mobileNavigation || !menuToggle) {
        return;
    }

    mobileNavigation.classList.add("is-open");
    document.body.classList.add("mobile-menu-open");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    if (menuClose) {
        window.setTimeout(() => {
            menuClose.focus();
        }, 100);
    }
}


/**
 * Close the mobile navigation menu.
 *
 * @param {boolean} restoreFocus
 */
function closeMobileMenu(restoreFocus = true) {
    if (!mobileNavigation || !menuToggle) {
        return;
    }

    mobileNavigation.classList.remove("is-open");
    document.body.classList.remove("mobile-menu-open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    if (restoreFocus) {
        menuToggle.focus();
    }
}


/**
 * Toggle the mobile navigation menu.
 */
function toggleMobileMenu() {
    if (!mobileNavigation) {
        return;
    }

    const isOpen =
        mobileNavigation.classList.contains("is-open");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


/* Mobile menu button */

if (menuToggle) {
    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );
}


/* Mobile menu close button */

if (menuClose) {
    menuClose.addEventListener(
        "click",
        () => closeMobileMenu()
    );
}


/* Close menu after selecting a navigation link */

mobileNavigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMobileMenu(false);
    });
});


/* Close menu after selecting Book a Table */

if (mobileReservationLink) {
    mobileReservationLink.addEventListener(
        "click",
        () => {
            closeMobileMenu(false);
        }
    );
}


/* Close mobile menu with Escape */

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (!mobileNavigation) {
            return;
        }

        if (
            !mobileNavigation.classList.contains(
                "is-open"
            )
        ) {
            return;
        }

        closeMobileMenu();
    }
);


/* Close mobile menu when returning to desktop */

window.addEventListener(
    "resize",
    () => {
        if (window.innerWidth >= 768) {
            if (
                mobileNavigation &&
                mobileNavigation.classList.contains(
                    "is-open"
                )
            ) {
                mobileNavigation.classList.remove(
                    "is-open"
                );
            }

            document.body.classList.remove(
                "mobile-menu-open"
            );

            if (menuToggle) {
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            }
        }
    }
);


/* =========================================================
   02. MENU FILTERING
   ========================================================= */

const menuFilters = document.querySelectorAll(
    ".menu-filter"
);

const menuItems = document.querySelectorAll(
    ".menu-item"
);

const menuStatus = document.querySelector(
    "#menu-status"
);


const menuCategoryNames = {
    starter: {
        singular: "starter",
        plural: "starters"
    },

    main: {
        singular: "main",
        plural: "mains"
    },

    grill: {
        singular: "dish from the grill",
        plural: "dishes from the grill"
    },

    vegetarian: {
        singular: "vegetarian dish",
        plural: "vegetarian dishes"
    },

    dessert: {
        singular: "dessert",
        plural: "desserts"
    }
};


/**
 * Update the menu accessibility status.
 *
 * @param {string} filter
 * @param {number} visibleCount
 */
function updateMenuStatus(
    filter,
    visibleCount
) {
    if (!menuStatus) {
        return;
    }

    if (filter === "all") {
        const dishWord =
            visibleCount === 1
                ? "dish"
                : "dishes";

        menuStatus.textContent =
            `Showing ${visibleCount} ${dishWord}.`;

        return;
    }

    const category =
        menuCategoryNames[filter];

    if (!category) {
        menuStatus.textContent =
            `Showing ${visibleCount} dishes.`;

        return;
    }

    const categoryWord =
        visibleCount === 1
            ? category.singular
            : category.plural;

    menuStatus.textContent =
        `Showing ${visibleCount} ${categoryWord}.`;
}


/**
 * Filter the menu.
 *
 * @param {string} filter
 */
function filterMenu(filter) {
    let visibleCount = 0;

    menuItems.forEach((item) => {
        const itemCategory =
            item.dataset.category;

        const shouldShow =
            filter === "all" ||
            itemCategory === filter;

        item.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount += 1;
        }
    });

    menuFilters.forEach((button) => {
        const isActive =
            button.dataset.filter === filter;

        button.classList.toggle(
            "is-active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });

    updateMenuStatus(
        filter,
        visibleCount
    );
}


/* Menu filter buttons */

menuFilters.forEach((button) => {
    button.addEventListener(
        "click",
        () => {
            const filter =
                button.dataset.filter;

            if (!filter) {
                return;
            }

            filterMenu(filter);
        }
    );
});


/* Initial menu state */

if (menuFilters.length > 0) {
    filterMenu("all");
}


/* =========================================================
   03. GALLERY LIGHTBOX
   ========================================================= */

const galleryItems = document.querySelectorAll(
    ".gallery-item"
);

const galleryLightbox = document.querySelector(
    "#gallery-lightbox"
);

const galleryLightboxImage =
    document.querySelector(
        ".gallery-lightbox-image"
    );

const galleryLightboxCounter =
    document.querySelector(
        ".gallery-lightbox-counter"
    );

const galleryLightboxTitle =
    document.querySelector(
        ".gallery-lightbox-title"
    );

const galleryLightboxClose =
    document.querySelector(
        ".gallery-lightbox-close"
    );

const galleryLightboxPrevious =
    document.querySelector(
        ".gallery-lightbox-prev"
    );

const galleryLightboxNext =
    document.querySelector(
        ".gallery-lightbox-next"
    );

const galleryLightboxBackdrop =
    document.querySelector(
        ".gallery-lightbox-backdrop"
    );


const galleryData =
    Array.from(galleryItems).map(
        (item, index) => {
            const image =
                item.querySelector("img");

            return {
                index,
                src: image
                    ? image.src
                    : "",
                alt: image
                    ? image.alt
                    : `SAVORÉ gallery image ${index + 1}`,
                title:
                    `SAVORÉ Gallery ${String(
                        index + 1
                    ).padStart(2, "0")}`
            };
        }
    );


let currentGalleryIndex = 0;
let previousGalleryFocus = null;


/**
 * Update the image displayed inside the lightbox.
 *
 * @param {number} index
 */
function updateGalleryLightbox(index) {
    if (
        !galleryLightboxImage ||
        !galleryLightboxCounter ||
        !galleryLightboxTitle
    ) {
        return;
    }

    if (galleryData.length === 0) {
        return;
    }

    const safeIndex =
        (index + galleryData.length) %
        galleryData.length;

    const imageData =
        galleryData[safeIndex];

    currentGalleryIndex =
        safeIndex;

    galleryLightboxImage.src =
        imageData.src;

    galleryLightboxImage.alt =
        imageData.alt;

    galleryLightboxCounter.textContent =
        `${String(safeIndex + 1).padStart(2, "0")} / ${String(
            galleryData.length
        ).padStart(2, "0")}`;

    galleryLightboxTitle.textContent =
        imageData.title;
}


/**
 * Open the gallery lightbox.
 *
 * @param {number} index
 */
function openGalleryLightbox(index) {
    if (!galleryLightbox) {
        return;
    }

    previousGalleryFocus =
        document.activeElement;

    updateGalleryLightbox(index);

    galleryLightbox.classList.add(
        "is-open"
    );

    galleryLightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "gallery-lightbox-open"
    );

    if (galleryLightboxClose) {
        galleryLightboxClose.focus();
    }
}


/**
 * Close the gallery lightbox.
 */
function closeGalleryLightbox() {
    if (!galleryLightbox) {
        return;
    }

    galleryLightbox.classList.remove(
        "is-open"
    );

    galleryLightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "gallery-lightbox-open"
    );

    if (
        previousGalleryFocus &&
        typeof previousGalleryFocus.focus ===
            "function"
    ) {
        previousGalleryFocus.focus();
    }

    previousGalleryFocus = null;
}


/**
 * Show previous gallery image.
 */
function showPreviousGalleryImage() {
    updateGalleryLightbox(
        currentGalleryIndex - 1
    );
}


/**
 * Show next gallery image.
 */
function showNextGalleryImage() {
    updateGalleryLightbox(
        currentGalleryIndex + 1
    );
}


/* Add accessible labels to gallery buttons */

galleryItems.forEach((item, index) => {
    item.setAttribute(
        "aria-label",
        `Open gallery image ${index + 1}`
    );
});


/* Gallery image click */

galleryItems.forEach((item) => {
    item.addEventListener(
        "click",
        () => {
            const index =
                Number(
                    item.dataset.galleryIndex
                );

            if (Number.isNaN(index)) {
                return;
            }

            openGalleryLightbox(index);
        }
    );
});


/* Close button */

if (galleryLightboxClose) {
    galleryLightboxClose.addEventListener(
        "click",
        closeGalleryLightbox
    );
}


/* Previous button */

if (galleryLightboxPrevious) {
    galleryLightboxPrevious.addEventListener(
        "click",
        showPreviousGalleryImage
    );
}


/* Next button */

if (galleryLightboxNext) {
    galleryLightboxNext.addEventListener(
        "click",
        showNextGalleryImage
    );
}


/* Backdrop */

if (galleryLightboxBackdrop) {
    galleryLightboxBackdrop.addEventListener(
        "click",
        closeGalleryLightbox
    );
}


/* Gallery keyboard controls */

document.addEventListener(
    "keydown",
    (event) => {
        if (!galleryLightbox) {
            return;
        }

        if (
            !galleryLightbox.classList.contains(
                "is-open"
            )
        ) {
            return;
        }

        if (event.key === "Escape") {
            closeGalleryLightbox();
            return;
        }

        if (event.key === "ArrowLeft") {
            showPreviousGalleryImage();
            return;
        }

        if (event.key === "ArrowRight") {
            showNextGalleryImage();
        }
    }
);


/* =========================================================
   04. LIGHTBOX KEYBOARD FOCUS TRAP
   ========================================================= */


/**
 * Get visible keyboard-focusable elements.
 *
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter((element) => {
        return (
            element.offsetWidth > 0 ||
            element.offsetHeight > 0 ||
            element === document.activeElement
        );
    });
}


if (galleryLightbox) {
    galleryLightbox.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Tab") {
                return;
            }

            if (
                !galleryLightbox.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }

            const focusableElements =
                getFocusableElements(
                    galleryLightbox
                );

            if (
                focusableElements.length === 0
            ) {
                event.preventDefault();
                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                    focusableElements.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement ===
                    firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement ===
                    lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    );
}


/* =========================================================
   05. RESERVATION FORM
   ========================================================= */

const reservationForm =
    document.querySelector(
        "#reservation-form"
    );

const reservationSuccess =
    document.querySelector(
        "#reservation-success"
    );

const reservationReset =
    document.querySelector(
        ".reservation-reset"
    );

const reservationDate =
    document.querySelector(
        "#reservation-date"
    );


/**
 * Set today's date as the earliest selectable date.
 */
function setReservationMinimumDate() {
    if (!reservationDate) {
        return;
    }

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    reservationDate.min =
        `${year}-${month}-${day}`;
}


setReservationMinimumDate();


/**
 * Get a reservation form field.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function getReservationField(id) {
    return document.getElementById(id);
}


/**
 * Get a reservation field's error element.
 *
 * @param {string} fieldId
 * @returns {HTMLElement|null}
 */
function getReservationError(fieldId) {
    return document.querySelector(
        `[data-error-for="${fieldId}"]`
    );
}


/**
 * Clear a reservation field error.
 *
 * @param {string} fieldId
 */
function clearReservationError(fieldId) {
    const field =
        getReservationField(fieldId);

    const error =
        getReservationError(fieldId);

    if (field) {
        field.removeAttribute(
            "aria-invalid"
        );

        field.removeAttribute(
            "aria-describedby"
        );
    }

    if (error) {
        error.textContent = "";
    }
}


/**
 * Set a reservation field error.
 *
 * @param {string} fieldId
 * @param {string} message
 */
function setReservationError(
    fieldId,
    message
) {
    const field =
        getReservationField(fieldId);

    const error =
        getReservationError(fieldId);

    if (field) {
        field.setAttribute(
            "aria-invalid",
            "true"
        );

        if (error && error.id) {
            field.setAttribute(
                "aria-describedby",
                error.id
            );
        }
    }

    if (error) {
        error.textContent =
            message;
    }
}


/**
 * Validate the reservation form.
 *
 * @returns {boolean}
 */
function validateReservationForm() {
    const fields = [
        "reservation-name",
        "reservation-email",
        "reservation-phone",
        "reservation-guests",
        "reservation-date",
        "reservation-time"
    ];

    fields.forEach(
        clearReservationError
    );

    let firstInvalidField = null;

    const name =
        getReservationField(
            "reservation-name"
        );

    const email =
        getReservationField(
            "reservation-email"
        );

    const phone =
        getReservationField(
            "reservation-phone"
        );

    const guests =
        getReservationField(
            "reservation-guests"
        );

    const date =
        getReservationField(
            "reservation-date"
        );

    const time =
        getReservationField(
            "reservation-time"
        );


    /* Full name */

    if (
        !name ||
        name.value.trim().length < 2
    ) {
        setReservationError(
            "reservation-name",
            "Please enter your full name."
        );

        firstInvalidField =
            firstInvalidField ||
            name;
    }


    /* Email */

    if (
        !email ||
        !email.validity.valid
    ) {
        setReservationError(
            "reservation-email",
            "Please enter a valid email address."
        );

        firstInvalidField =
            firstInvalidField ||
            email;
    }


    /* Phone */

    const phoneDigits =
        phone
            ? phone.value.replace(
                  /\D/g,
                  ""
              )
            : "";

    if (
        phoneDigits.length < 7
    ) {
        setReservationError(
            "reservation-phone",
            "Please enter a valid phone number."
        );

        firstInvalidField =
            firstInvalidField ||
            phone;
    }


    /* Guests */

    if (
        !guests ||
        !guests.value
    ) {
        setReservationError(
            "reservation-guests",
            "Please select the number of guests."
        );

        firstInvalidField =
            firstInvalidField ||
            guests;
    }


    /* Date */

    if (
        !date ||
        !date.value
    ) {
        setReservationError(
            "reservation-date",
            "Please select a date."
        );

        firstInvalidField =
         firstInvalidField ||
            date;
    } else if (
        reservationDate &&
        date.value <
            reservationDate.min
    ) {
        setReservationError(
            "reservation-date",
            "Please choose today or a future date."
        );

        firstInvalidField =
            firstInvalidField ||
            date;
    }


    /* Time */

    if (
        !time ||
        !time.value
    ) {
        setReservationError(
            "reservation-time",
            "Please select a preferred time."
        );

        firstInvalidField =
            firstInvalidField ||
            time;
    }


    /* Focus first invalid field */

    if (firstInvalidField) {
        firstInvalidField.focus();
        return false;
    }

    return true;
}


/* Reservation submission */

if (reservationForm) {
    reservationForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            if (
                !validateReservationForm()
            ) {
                return;
            }

            reservationForm.hidden =
                true;

            if (reservationSuccess) {
                reservationSuccess.hidden =
                    false;

                reservationSuccess.focus();
            }
        }
    );
}


/* Reservation reset */

if (reservationReset) {
    reservationReset.addEventListener(
        "click",
        () => {
            if (
                !reservationForm ||
                !reservationSuccess
            ) {
                return;
            }

            reservationSuccess.hidden =
                true;

            reservationForm.hidden =
                false;

            reservationForm.reset();

            setReservationMinimumDate();

            const firstField =
                getReservationField(
                    "reservation-name"
                );

            if (firstField) {
                firstField.focus();
            }
        }
    );
}


/* Clear errors while editing */

const reservationInputs =
    document.querySelectorAll(
        "#reservation-form input, #reservation-form select, #reservation-form textarea"
    );


reservationInputs.forEach(
    (field) => {
        field.addEventListener(
            "input",
            () => {
                clearReservationError(
                    field.id
                );
            }
        );

        field.addEventListener(
            "change",
            () => {
                clearReservationError(
                    field.id
                );
            }
        );
    }
);


/* =========================================================
   06. HEADER SCROLL STATE
   ========================================================= */

const siteHeader =
    document.querySelector(
        ".site-header"
    );


function updateHeaderScrollState() {
    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 40) {
        siteHeader.classList.add(
            "is-scrolled"
        );
    } else {
        siteHeader.classList.remove(
            "is-scrolled"
        );
    }
}


updateHeaderScrollState();


window.addEventListener(
    "scroll",
    updateHeaderScrollState,
    {
        passive: true
    }
);


/* =========================================================
   07. LIGHTBOX SCROLL LOCK
   ========================================================= */

const galleryStyle =
    document.createElement("style");

galleryStyle.textContent = `
    body.gallery-lightbox-open {
        overflow: hidden;
    }

    body.mobile-menu-open {
        overflow: hidden;
    }
`;

document.head.appendChild(
    galleryStyle
);   