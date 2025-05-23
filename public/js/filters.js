// Smooth Category Filtering
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const category = this.dataset.category;
    filterByCategory(category);
  });
});

function filterByCategory(category) {
  const listings = document.querySelectorAll('.listing-card');
  
  listings.forEach(listing => {
    if (category === 'all' || listing.dataset.category === category) {
      listing.classList.remove('hidden');
      listing.classList.add('fade-in');
    } else {
      listing.classList.add('hidden');
    }
  });
}

// Tax Toggle Functionality
document.getElementById('taxSwitch')?.addEventListener('change', function() {
  const isChecked = this.checked;
  const priceElements = document.querySelectorAll('.price-display');
  
  priceElements.forEach(element => {
    const originalPrice = parseInt(element.dataset.originalPrice || element.textContent.replace(/[₹,]/g, ''));
    if (!element.dataset.originalPrice) {
      element.dataset.originalPrice = originalPrice;
    }
    
    if (isChecked) {
      const totalPrice = Math.round(originalPrice * 1.18);
      element.textContent = `₹${totalPrice}/night (incl. taxes)`;
    } else {
      element.textContent = `₹${originalPrice}/night`;
    }
  });
});

// Modal Filter Functions
function applyFilters() {
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  
  const listings = document.querySelectorAll('.listing-card');
  listings.forEach(listing => {
    const price = parseInt(listing.dataset.price);
    const showListing = (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    
    if (showListing) {
      listing.classList.remove('hidden');
    } else {
      listing.classList.add('hidden');
    }
  });
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('filtersModal'));
  modal.hide();
}

function clearFilters() {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  
  // Show all listings
  document.querySelectorAll('.listing-card').forEach(listing => {
    listing.classList.remove('hidden');
  });
}

// Smooth scroll for filter bar
document.addEventListener('DOMContentLoaded', function() {
  const filterBar = document.querySelector('.sticky-top');
  if (filterBar) {
    filterBar.style.transition = 'all 0.3s ease';
  }
});
// CATEGORY FILTER BUTTONS
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove 'active' from all
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const category = this.dataset.category;
    document.querySelectorAll('.listing-card').forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
// TAX SWITCH FUNCTIONALITY
document.getElementById('taxSwitch')?.addEventListener('change', function() {
  const isChecked = this.checked;
  document.querySelectorAll('.price-display').forEach(element => {
    // Save original price if not already saved
    if (!element.dataset.originalPrice) {
      element.dataset.originalPrice = element.textContent.replace(/[^\d]/g, '');
    }
    const originalPrice = parseInt(element.dataset.originalPrice);
    if (isChecked) {
      const total = Math.round(originalPrice * 1.18);
      element.textContent = `₹${total}/night (incl. taxes)`;
    } else {
      element.textContent = `₹${originalPrice}/night`;
    }
  });
});
// FILTER MODAL FUNCTIONALITY
function applyFilters() {
  const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

  document.querySelectorAll('.listing-card').forEach(card => {
    const price = parseInt(card.dataset.price);
    if (price >= minPrice && price <= maxPrice) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  // Close modal (Bootstrap 5)
  const modal = bootstrap.Modal.getInstance(document.getElementById('filtersModal'));
  modal.hide();
}

function clearFilters() {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.querySelectorAll('.listing-card').forEach(card => {
    card.style.display = '';
  });
}
