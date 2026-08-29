// Scroll reveal animations
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

// Smooth counter animation
function animateCounter(element) {
  const target = Number(element.dataset.target);
  if (isNaN(target)) return;

  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${prefix}${value.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('[data-target]').forEach((counter) => {
  counterObserver.observe(counter);
});

// Cursor glow tracking
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  window.addEventListener('pointermove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    document.documentElement.style.setProperty('--cursor-x', `${x}px`);
    document.documentElement.style.setProperty('--cursor-y', `${y}px`);
  });
}

// -------------------------------------------------------------
// REAL-TIME LEETCODE STATS
// -------------------------------------------------------------
// REAL-TIME LEETCODE STATS
// -------------------------------------------------------------
async function fetchLeetCodeStats() {
  const username = '2005_Gowtham';
  let data = null;

  // Primary API: High-speed, unthrottled Vercel edge endpoint
  try {
    const res1 = await fetch(`https://leetcode-api-pied.vercel.app/user/${username}`);
    if (res1.ok) {
      data = await res1.json();
    }
  } catch (e) {
    console.warn('Primary LeetCode endpoint unavailable, trying fallback...');
  }

  // Fallback API: Render community instance
  if (!data) {
    try {
      const res2 = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
      if (res2.ok) {
        data = await res2.json();
      }
    } catch (e) {
      console.warn('Fallback LeetCode endpoint unavailable.');
    }
  }

  if (!data) return;

  // Parse Stats from either endpoint format
  let totalSolved = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let ranking = 0;
  let acceptanceRate = null;

  if (data.submitStats && data.submitStats.acSubmissionNum) {
    // Format A: leetcode-api-pied
    const acs = data.submitStats.acSubmissionNum;
    const allAc = acs.find((x) => x.difficulty === 'All');
    const easyAc = acs.find((x) => x.difficulty === 'Easy');
    const medAc = acs.find((x) => x.difficulty === 'Medium');
    const hardAc = acs.find((x) => x.difficulty === 'Hard');

    totalSolved = allAc ? allAc.count : 0;
    easySolved = easyAc ? easyAc.count : 0;
    mediumSolved = medAc ? medAc.count : 0;
    hardSolved = hardAc ? hardAc.count : 0;
    ranking = data.profile?.ranking || 0;

    const totalSubs = data.submitStats.totalSubmissionNum?.find((x) => x.difficulty === 'All');
    if (allAc && totalSubs && totalSubs.submissions > 0) {
      acceptanceRate = ((allAc.submissions / totalSubs.submissions) * 100).toFixed(1);
    }
  } else if (data.totalSolved) {
    // Format B: alfa-leetcode-api
    totalSolved = data.totalSolved;
    easySolved = data.easySolved || 0;
    mediumSolved = data.mediumSolved || 0;
    hardSolved = data.hardSolved || 0;
    ranking = data.ranking || 0;

    const allSub = data.matchedUserStats?.totalSubmissionNum?.find((x) => x.difficulty === 'All');
    const acSub = data.matchedUserStats?.acSubmissionNum?.find((x) => x.difficulty === 'All');
    if (allSub && acSub && allSub.submissions > 0) {
      acceptanceRate = ((acSub.submissions / allSub.submissions) * 100).toFixed(1);
    }
  }

  // Update DOM Elements
  if (totalSolved > 0) {
    const solvedNum = document.querySelector('#lc-total-solved .metric-num');
    if (solvedNum) {
      solvedNum.dataset.target = totalSolved;
      solvedNum.textContent = totalSolved;
    }
  }

  if (ranking > 0) {
    const rankEl = document.getElementById('lc-global-rank');
    if (rankEl) {
      rankEl.textContent = `#${Number(ranking).toLocaleString()}`;
    }
  }

  const easyEl = document.getElementById('lc-easy');
  const medEl = document.getElementById('lc-medium');
  const hardEl = document.getElementById('lc-hard');

  if (easyEl && easySolved > 0) easyEl.textContent = easySolved;
  if (medEl && mediumSolved > 0) medEl.textContent = mediumSolved;
  if (hardEl && hardSolved > 0) hardEl.textContent = hardSolved;

  if (acceptanceRate) {
    const acceptEl = document.getElementById('lc-acceptance');
    if (acceptEl) {
      acceptEl.textContent = `${acceptanceRate}%`;
    }
  }

  // Calculate Streak if submissionCalendar is available
  if (data.submissionCalendar) {
    const timestamps = Object.keys(data.submissionCalendar).map(Number).sort((a, b) => b - a);
    if (timestamps.length > 0) {
      let streak = 0;
      const nowSec = Math.floor(Date.now() / 1000);
      let lastDay = Math.floor(nowSec / 86400);

      for (const ts of timestamps) {
        const day = Math.floor(ts / 86400);
        if (day === lastDay || day === lastDay - 1) {
          streak++;
          lastDay = day;
        } else if (day < lastDay - 1) {
          break;
        }
      }

      const streakEl = document.getElementById('lc-streak');
      if (streakEl && streak > 0) {
        streakEl.innerHTML = `<span class="flame-icon">🔥</span>${streak}d`;
      }
    }
  }
}

// -------------------------------------------------------------
// INTERACTIVE CONTACT FORM
// -------------------------------------------------------------
function setupContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name')?.value.trim();
    const email = form.querySelector('#form-email')?.value.trim();
    const subject = form.querySelector('#form-subject')?.value.trim() || 'Portfolio Contact';
    const message = form.querySelector('#form-message')?.value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill in all required fields (Name, Email, Message).';
      }
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
    }

    setTimeout(() => {
      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = `✓ Thank you, ${name}! Your message is ready. Opening your email client to send...`;
      }

      const mailtoUrl = `mailto:gowthamkarthikeyan2005@gmail.com?subject=${encodeURIComponent(
        subject + ' - ' + name
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

      window.location.href = mailtoUrl;

      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><span class="btn-arrow" aria-hidden="true">&rarr;</span>';
      }

      setTimeout(() => {
        if (feedback) {
          feedback.style.display = 'none';
        }
      }, 7000);
    }, 500);
  });
}

// -------------------------------------------------------------
// DARK / LIGHT THEME CONTROLLER
// -------------------------------------------------------------
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });
}

// Run theme check immediately
initTheme();

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  fetchLeetCodeStats();
  setupContactForm();
});
