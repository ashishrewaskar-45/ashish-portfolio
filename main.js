/**
 * ============================================================================
 * Ashish Rewaskar - Main Application Script
 * Dynamic Gallery, Lightbox, Featured Projects, Form, Uploader & Interactions
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolioProjects('all');
  renderFeaturedProjects();
  initFilterTabs();
  initProjectModal();
  initUploaderModal();
  initMobileNav();
  initHeaderScrollSpy();
  initContactForm();
  initClipboardActions();
  initSmoothScroll();
});

/**
 * Render Portfolio Project Cards dynamically from data.js
 */
function renderPortfolioProjects(filterCategory = 'all') {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;

  const filteredProjects = filterCategory === 'all' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === filterCategory);

  portfolioGrid.innerHTML = '';

  if (filteredProjects.length === 0) {
    portfolioGrid.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🎨</div>
        <h3>No designs in this category yet</h3>
        <p>Use the <strong>+ Add / Preview Design</strong> button above to add your designs here!</p>
      </div>
    `;
    return;
  }

  filteredProjects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.style.animationDelay = `${index * 0.08}s`;
    card.setAttribute('data-id', project.id);
    card.setAttribute('data-category', project.category);

    const toolsChips = project.tools ? project.tools.slice(0, 2).map(tool => `<span class="tool-tag">${tool}</span>`).join(' • ') : '';

    card.innerHTML = `
      <div class="project-image-box" onclick="openProjectModal('${project.id}')">
        <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'">
        <div class="project-overlay">
          <button class="overlay-btn" onclick="openProjectModal('${project.id}')" aria-label="View design preview">
            <span>View Design</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </button>
        </div>
      </div>
      <div class="project-info">
        <div class="project-category-row">
          <span class="project-category">${project.categoryLabel || project.category}</span>
          <span class="project-tools">${toolsChips}</span>
        </div>
        <h3 class="project-title" onclick="openProjectModal('${project.id}')" style="cursor: pointer;">${project.title}</h3>
        <p class="project-desc">${project.shortDesc || ''}</p>
        <div class="project-footer">
          <button class="project-view-link" onclick="openProjectModal('${project.id}')">
            <span>Full Preview</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${project.year || '2024'}</span>
        </div>
      </div>
    `;

    portfolioGrid.appendChild(card);
  });

  // Re-observe new elements for reveal animation
  if (window.initScrollObserver) {
    window.initScrollObserver();
  }
}

/**
 * Render 3-4 Large Featured Project Cards
 */
function renderFeaturedProjects() {
  const featuredGrid = document.getElementById('featured-grid');
  if (!featuredGrid) return;

  const featuredItems = PORTFOLIO_PROJECTS.filter(p => p.featured).slice(0, 4);

  featuredGrid.innerHTML = '';

  featuredItems.forEach((project, idx) => {
    const card = document.createElement('div');
    card.className = `featured-card reveal ${idx % 2 === 1 ? 'featured-card-reverse' : ''}`;
    
    card.innerHTML = `
      <div class="featured-image-col" onclick="openProjectModal('${project.id}')">
        <div class="featured-image-frame">
          <img src="${project.image}" alt="${project.title}" class="featured-img" loading="lazy">
          <div class="featured-badge-tag">${project.categoryLabel || project.category}</div>
        </div>
      </div>
      <div class="featured-content-col">
        <div class="featured-category">${project.categoryLabel || project.category} • Signature Work</div>
        <h3 class="featured-title">${project.title}</h3>
        <p class="featured-desc">${project.fullDesc || project.shortDesc}</p>
        <div class="featured-deliverables">
          ${(project.deliverables || []).map(d => `<span class="about-tag"><span class="dot"></span> ${d}</span>`).join('')}
        </div>
        <div class="featured-btn-wrap">
          <button class="btn btn-primary" onclick="openProjectModal('${project.id}')">
            <span>View Project</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </button>
        </div>
      </div>
    `;

    featuredGrid.appendChild(card);
  });
}

/**
 * Filter Tabs Logic
 */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      renderPortfolioProjects(filterValue);
    });
  });
}

/**
 * Project Lightbox / Modal
 */
let currentModalProjectId = null;

function initProjectModal() {
  const backdrop = document.getElementById('project-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!backdrop) return;

  // Close on backdrop click (outside container)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeProjectModal();
    }
  });

  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = PORTFOLIO_PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  currentModalProjectId = projectId;
  const backdrop = document.getElementById('project-modal-backdrop');
  const modalImg = document.getElementById('modal-project-img');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalClient = document.getElementById('modal-project-client');
  const modalYear = document.getElementById('modal-project-year');
  const modalTools = document.getElementById('modal-project-tools');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalDeliverables = document.getElementById('modal-project-deliverables');

  if (modalImg) {
    modalImg.src = project.image;
    modalImg.alt = project.title;
  }
  if (modalCategory) modalCategory.textContent = project.categoryLabel || project.category;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalClient) modalClient.textContent = project.client || 'Client Commission';
  if (modalYear) modalYear.textContent = project.year || '2024';
  if (modalTools) modalTools.textContent = project.tools ? project.tools.join(', ') : 'Graphic Design';
  if (modalDesc) modalDesc.textContent = project.fullDesc || project.shortDesc;

  if (modalDeliverables) {
    if (project.deliverables && project.deliverables.length) {
      modalDeliverables.innerHTML = project.deliverables
        .map(d => `<span class="about-tag"><span class="dot"></span> ${d}</span>`)
        .join('');
      modalDeliverables.style.display = 'flex';
    } else {
      modalDeliverables.style.display = 'none';
    }
  }

  // Pre-fill contact service if user clicks inquire inside modal
  const modalInquireBtn = document.getElementById('modal-inquire-btn');
  if (modalInquireBtn) {
    modalInquireBtn.onclick = () => {
      closeProjectModal();
      selectServiceInForm(project.categoryLabel || project.category);
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const backdrop = document.getElementById('project-modal-backdrop');
  if (!backdrop) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

/**
 * In-Browser Custom Design Uploader & Live Preview
 */
function initUploaderModal() {
  const openBtn = document.getElementById('btn-open-uploader');
  const backdrop = document.getElementById('uploader-modal-backdrop');
  const closeBtn = document.getElementById('uploader-close-btn');
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('design-file-input');
  const previewWrap = document.getElementById('upload-preview-wrap');
  const previewImg = document.getElementById('upload-preview-img');
  const saveBtn = document.getElementById('btn-save-custom-design');
  const titleInput = document.getElementById('upload-title');
  const catSelect = document.getElementById('upload-category');

  if (!openBtn || !backdrop) return;

  let currentImageDataUrl = null;

  openBtn.addEventListener('click', () => {
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeUploader = () => {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeUploader);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeUploader();
  });

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--accent-primary)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-medium)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-medium)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please upload an image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentImageDataUrl = e.target.result;
      if (previewImg && previewWrap) {
        previewImg.src = currentImageDataUrl;
        previewWrap.style.display = 'block';
      }
      if (titleInput && !titleInput.value) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      }
    };
    reader.readAsDataURL(file);
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!currentImageDataUrl) {
        showToast('⚠️ Please select an image first.', 'error');
        return;
      }
      const title = titleInput?.value.trim() || 'Custom Graphic Design';
      const category = catSelect?.value || 'posters';
      const catLabels = {
        'posters': 'Posters',
        'banners': 'Banners',
        'social-media': 'Social Media',
        'branding': 'Branding',
        'presentations': 'Presentations'
      };

      const newProject = {
        id: `custom-${Date.now()}`,
        title: title,
        category: category,
        categoryLabel: catLabels[category] || 'Graphic Design',
        tools: ['Canva', 'Graphic Design'],
        shortDesc: 'Custom uploaded graphic design creative.',
        fullDesc: `High-impact ${catLabels[category] || 'graphic design'} created with custom branding and typography.`,
        image: currentImageDataUrl,
        client: 'Client Work',
        year: new Date().getFullYear().toString(),
        deliverables: ['High-Res Image', 'Digital Deliverable'],
        featured: false
      };

      PORTFOLIO_PROJECTS.unshift(newProject);
      renderPortfolioProjects('all');
      
      // Reset & close
      if (titleInput) titleInput.value = '';
      if (previewWrap) previewWrap.style.display = 'none';
      currentImageDataUrl = null;
      closeUploader();

      showToast(`🎉 "${title}" added to your live portfolio!`, 'success');

      const portfolioSec = document.getElementById('portfolio');
      if (portfolioSec) portfolioSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    });
  });
}

/**
 * Header Background & ScrollSpy Navigation
 */
function initHeaderScrollSpy() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/**
 * Interactive Contact Form
 * Submits to the secure backend API at POST /api/contact
 * which sends email (Resend) + SMS (Twilio) to Ashish.
 */
function initContactForm() {
  const form      = document.getElementById('portfolio-contact-form');
  const statusBox = document.getElementById('form-status-box');

  if (!form) return;

  // ── Client-side rate limit: track last submission time ──────────────────────
  let lastSubmitTime = 0;
  const MIN_SUBMIT_INTERVAL_MS = 60 * 1000; // 1 minute between submissions per browser session

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name      = document.getElementById('form-name')?.value.trim();
    const email     = document.getElementById('form-email')?.value.trim();
    const service   = document.getElementById('form-service')?.value.trim();
    const message   = document.getElementById('form-message')?.value.trim();
    const honeypot  = document.getElementById('_honeypot')?.value || '';
    const submitBtn = form.querySelector('button[type="submit"]');

    // ── Client-side validation ─────────────────────────────────────────────────
    if (!name || !email || !message) {
      showFormStatus(statusBox, 'error', '⚠️ Please fill out all required fields.');
      showToast('⚠️ Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus(statusBox, 'error', '⚠️ Please enter a valid email address.');
      showToast('⚠️ Please enter a valid email address.', 'error');
      return;
    }

    if (message.length < 10) {
      showFormStatus(statusBox, 'error', '⚠️ Project details must be at least 10 characters.');
      showToast('⚠️ Please describe your project in more detail.', 'error');
      return;
    }

    // ── Client-side cooldown check ─────────────────────────────────────────────
    const now = Date.now();
    if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL_MS) {
      const secsLeft = Math.ceil((MIN_SUBMIT_INTERVAL_MS - (now - lastSubmitTime)) / 1000);
      showToast(`⏳ Please wait ${secsLeft}s before sending another message.`, 'error');
      return;
    }

    // ── Loading state ──────────────────────────────────────────────────────────
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="animation: spin 1s linear infinite; flex-shrink: 0;">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span>Sending Message...</span>
      `;
    }

    // ── Send to backend API ────────────────────────────────────────────────────
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, message, _honeypot: honeypot }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (_) {
        data = { success: false, message: 'Something went wrong. Please try again.' };
      }

      if (response.status === 429) {
        // Rate limited by server
        showFormStatus(statusBox, 'error', '⏳ Too many messages sent. Please wait 15 minutes and try again.');
        showToast('⏳ Too many messages. Please wait before trying again.', 'error');
        return;
      }

      if (data.success) {
        // ── SUCCESS ──────────────────────────────────────────────────────────
        lastSubmitTime = Date.now();
        form.reset();
        showFormStatus(statusBox, 'success', `✅ Message sent successfully! I'll get back to you soon.`);
        showToast("🎉 Message sent! Ashish will get back to you within 24 hours.", 'success');
      } else {
        // ── SERVER-SIDE ERROR ─────────────────────────────────────────────────
        const errMsg = data.message || 'Something went wrong. Please try again.';
        showFormStatus(statusBox, 'error', `❌ ${errMsg}`);
        showToast(`⚠️ ${errMsg}`, 'error');
      }

    } catch (networkErr) {
      // ── NETWORK / FETCH ERROR ─────────────────────────────────────────────
      console.error('Contact form network error:', networkErr);
      showFormStatus(statusBox, 'error', '❌ Something went wrong. Please try again.');
      showToast('❌ Something went wrong. Please try again.', 'error');
    } finally {
      // ── Restore button regardless of outcome ──────────────────────────────
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        `;
      }
    }
  });
}

/**
 * Show a status message inside the form's status box.
 * @param {HTMLElement|null} box  - The status container element
 * @param {'success'|'error'} type
 * @param {string} text
 */
function showFormStatus(box, type, text) {
  if (!box) return;
  box.className = `form-status ${type}`;
  box.textContent = text;
  box.style.display = 'block';
  // Auto-hide after 7 seconds
  clearTimeout(box._hideTimer);
  box._hideTimer = setTimeout(() => {
    box.style.display = 'none';
  }, 7000);
}

function selectServiceInForm(serviceName) {
  const select = document.getElementById('form-service');
  if (!select) return;

  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
        select.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
      select.selectedIndex = i;
      break;
    }
  }
}
window.selectServiceInForm = selectServiceInForm;

/**
 * Clipboard Copy Actions (Email & Phone)
 */
function initClipboardActions() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('ashishrewaskar45@gmail.com').then(() => {
        showToast('📋 Email copied: ashishrewaskar45@gmail.com');
      });
    });
  });

  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('+91 9130321429').then(() => {
        showToast('📋 Phone copied: +91 9130321429');
      });
    });
  });
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderColor = '#ef4444';
  } else if (type === 'success') {
    toast.style.borderColor = '#10b981';
  }

  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutDown 0.35s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 3500);
}
window.showToast = showToast;

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
