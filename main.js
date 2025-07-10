$(document).ready(function () {
  // Add loading animation and enhanced UX
  let isLoading = false;

  // Enhanced form validation
  function validateForm() {
    const tenantName = $("#tenantName").val().trim();
    const pmReading = parseFloat($("#pmReading").val());
    const cmReading = parseFloat($("#cmReading").val());

    // Clear previous error states
    $(".form-input").removeClass("border-red-500").addClass("border-gray-300");
    $(".error-message").remove();

    let isValid = true;
    let errorMessages = [];

    if (!tenantName) {
      $("#tenantName")
        .removeClass("border-gray-300")
        .addClass("border-red-500");
      errorMessages.push("Tenant name is required");
      isValid = false;
    }

    if (isNaN(pmReading) || pmReading < 0) {
      $("#pmReading").removeClass("border-gray-300").addClass("border-red-500");
      errorMessages.push("Please enter a valid previous meter reading");
      isValid = false;
    }

    if (isNaN(cmReading) || cmReading < 0) {
      $("#cmReading").removeClass("border-gray-300").addClass("border-red-500");
      errorMessages.push("Please enter a valid current meter reading");
      isValid = false;
    }

    if (cmReading < pmReading) {
      $("#cmReading").removeClass("border-gray-300").addClass("border-red-500");
      errorMessages.push(
        "Current reading cannot be less than previous reading"
      );
      isValid = false;
    }

    // Show error messages if any
    if (!isValid) {
      showNotification(errorMessages.join("<br>"), "error");
    }

    return isValid;
  }

  // Enhanced notification system
  function showNotification(message, type = "success") {
    const notificationClass =
      type === "success" ? "bg-green-500" : "bg-red-500";
    const iconClass = type === "success" ? "text-green-500" : "text-red-500";
    const icon =
      type === "success"
        ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    const notification = $(`
            <div class="fixed bottom-8 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
              type === "success" ? "border-green-500" : "border-red-500"
            } p-4 transform translate-x-full transition-transform duration-300">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full ${
                          type === "success" ? "bg-green-100" : "bg-red-100"
                        } flex items-center justify-center">
                            <div class="${iconClass}">${icon}</div>
                        </div>
                    </div>
                    <div class="ml-3 w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900">${message}</p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button class="notification-close bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `);

    $("body").append(notification);

    // Animate in
    setTimeout(() => {
      notification.removeClass("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.addClass("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.find(".notification-close").click(function () {
      notification.addClass("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    });
  }

  // Enhanced bill generation with loading state
  $("#generateBill").click(function () {
    if (isLoading) return;

    if (!validateForm()) {
      return;
    }

    isLoading = true;
    const $button = $(this);
    const originalText = $button.html();

    // Show loading state
    $button.html(`
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Bill...
        `);
    $button.prop("disabled", true);

    // Simulate processing time for better UX
    setTimeout(() => {
      generateBill();
      isLoading = false;
      $button.html(originalText);
      $button.prop("disabled", false);
    }, 1000);
  });

  // Enhanced bill generation function
  function generateBill() {
    const tenantName = $("#tenantName").val().trim();
    const pmReading = parseFloat($("#pmReading").val());
    const cmReading = parseFloat($("#cmReading").val());

    const units = cmReading - pmReading;
    const unitCost = units * 3516;
    const vat = 0.18 * unitCost;
    const paye = 375;
    const rubbishExpense = 5000;
    const totalBill = Math.round(unitCost + vat + paye + rubbishExpense);

    // Create enhanced table row with animations
    const newRow = $(`
            <tr class="table-row border-b border-gray-200 hover:bg-gray-50 transition-all duration-300">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        ${tenantName}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pmReading.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cmReading.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${units.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${unitCost.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rubbishExpense.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">${totalBill.toLocaleString()}</td>
            </tr>
        `);

    // Add row with animation
    $("#billReport").append(newRow);
    newRow.hide().fadeIn(500);

    // Show table with animation
    $("#tableReport").slideDown(600);

    // Show success notification
    showNotification(
      `Bill generated successfully for ${tenantName}!`,
      "success"
    );

    // Add success animation to the form
    $("#formDetails").addClass("animate-pulse");
    setTimeout(() => {
      $("#formDetails").removeClass("animate-pulse");
    }, 1000);

    // Scroll to table
    $("html, body").animate(
      {
        scrollTop: $("#tableReport").offset().top - 100,
      },
      800
    );
  }

  // Enhanced reset functionality
  $("#resetButton").click(function (event) {
    event.preventDefault();

    if (isLoading) return;

    // Add confirmation for reset
    if ($("#billReport tr").length > 0) {
      if (
        !confirm(
          "Are you sure you want to reset the form? This will clear all generated bills."
        )
      ) {
        return;
      }
    }

    const $button = $(this);
    const originalText = $button.html();

    // Show loading state
    $button.html(`
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting...
        `);
    $button.prop("disabled", true);

    setTimeout(() => {
      // Reset form
      $("#formDetails")[0].reset();
      $("#billReport").empty();
      $("#tableReport").slideUp(400);

      // Clear error states
      $(".form-input")
        .removeClass("border-red-500")
        .addClass("border-gray-300");
      $(".error-message").remove();

      // Show success notification
      showNotification("Form has been reset successfully!", "success");

      // Reset button
      $button.html(originalText);
      $button.prop("disabled", false);

      // Scroll to top
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        600
      );
    }, 800);
  });

  // Enhanced input focus effects
  $(".form-input")
    .on("focus", function () {
      $(this)
        .parent()
        .addClass("transform scale-105 transition-transform duration-200");
    })
    .on("blur", function () {
      $(this).parent().removeClass("transform scale-105");
    });

  // Add enter key support for form submission
  $("#formDetails").on("keypress", function (e) {
    if (e.which === 13) {
      // Enter key
      e.preventDefault();
      $("#generateBill").click();
    }
  });

  // Add floating label animation
  $(".form-input").on("input", function () {
    const $input = $(this);
    const $label = $input.siblings("label");

    if ($input.val()) {
      $label.addClass("text-primary transform -translate-y-6 scale-75");
    } else {
      $label.removeClass("text-primary transform -translate-y-6 scale-75");
    }
  });

  // Initialize tooltips and enhance UX
  function initializeEnhancements() {
    // Add hover effects to buttons
    $(".btn-primary, .bg-gray-100").hover(
      function () {
        $(this).addClass("shadow-lg transform -translate-y-1");
      },
      function () {
        $(this).removeClass("shadow-lg transform -translate-y-1");
      }
    );

    // Add table row hover effects
    $(document)
      .on("mouseenter", ".table-row", function () {
        $(this).addClass("bg-primary/5");
      })
      .on("mouseleave", ".table-row", function () {
        $(this).removeClass("bg-primary/5");
      });

    // Add smooth scrolling
    $("html").css("scroll-behavior", "smooth");
  }

  // Initialize enhancements after DOM is ready
  initializeEnhancements();

  // Add keyboard shortcuts
  $(document).keydown(function (e) {
    // Ctrl/Cmd + Enter to generate bill
    if ((e.ctrlKey || e.metaKey) && e.which === 13) {
      e.preventDefault();
      $("#generateBill").click();
    }

    // Ctrl/Cmd + R to reset
    if ((e.ctrlKey || e.metaKey) && e.which === 82) {
      e.preventDefault();
      $("#resetButton").click();
    }
  });

  // Add welcome notification
  setTimeout(() => {
    showNotification(
      "Welcome to GETA Water Bill Management System! 🚰",
      "success"
    );
  }, 1000);

  // --- LOGIN MODAL LOGIC (migrated and fixed, using jQuery) ---
  // Ensure unique IDs for login buttons in HTML: #loginBtn (desktop), #loginBtnMobile (mobile)
  var $loginBtn = $('#loginBtn');
  var $loginBtnMobile = $('#loginBtnMobile');
  var $loginModal = $('#loginModal');
  var $closeModal = $('#closeModal');
  var $loginError = $('#loginError');

  // Show modal on desktop login button
  $loginBtn.on('click', function () {
    $loginModal.removeClass('hidden');
    $loginError.addClass('hidden');
  });
  // Show modal on mobile login button
  $loginBtnMobile.on('click', function () {
    $loginModal.removeClass('hidden');
    $loginError.addClass('hidden');
  });
  // Hide modal
  $closeModal.on('click', function () {
    $loginModal.addClass('hidden');
  });

  // Login form handler
  $('#adminLoginBtn').click(function(e){
    e.preventDefault();
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();
    if(username === "admin" && password === "password"){
      window.location.href = "dashboard.html";
    }else{
      $loginError.removeClass('hidden');
    }
  });

  $('#logoutBtn').click( function(){
    window.location.href = 'index.html';
  });

  // Mobile menu toggle
  $('#mobile-menu-button').click(function () {
    $('#mobile-menu').toggleClass('hidden');
  });
});
