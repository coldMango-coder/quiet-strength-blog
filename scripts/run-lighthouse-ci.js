#!/usr/bin/env node

/**
 * Run Lighthouse CI tests for production validation
 * Tests critical pages for 100/100 scores on mobile and desktop
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://trueallyguide.com';
const LIGHTHOUSE_CONFIG = {
  ci: {
    collect: {
      url: [
        `${BASE_URL}/`,
        `${BASE_URL}/blog/`,
        `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`,
        `${BASE_URL}/category/relationships-and-dating/`
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1.0 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'audits:largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'audits:cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'audits:total-blocking-time': ['error', { maxNumericValue: 50 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};

const MOBILE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...LIGHTHOUSE_CONFIG.ci,
    collect: {
      ...LIGHTHOUSE_CONFIG.ci.collect,
      settings: {
        ...LIGHTHOUSE_CONFIG.ci.collect.settings,
        preset: 'mobile'
      }
    }
  }
};

const DESKTOP_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  ci: {
    ...LIGHTHOUSE_CONFIG.ci,
    collect: {
      ...LIGHTHOUSE_CONFIG.ci.collect,
      settings: {
        ...LIGHTHOUSE_CONFIG.ci.collect.settings,
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1.0 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'audits:largest-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'audits:cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
        'audits:total-blocking-time': ['error', { maxNumericValue: 0 }]
      }
    }
  }
};

async function runLighthouseTests() {
  console.log('🚀 Starting Lighthouse CI tests for 100/100 validation...\n');

  const results = {
    mobile: { passed: false, errors: [] },
    desktop: { passed: false, errors: [] }
  };

  // Test Mobile
  console.log('📱 Testing Mobile Performance...');
  try {
    fs.writeFileSync('.lighthouserc-mobile.js', `module.exports = ${JSON.stringify(MOBILE_CONFIG, null, 2)};`);
    
    const mobileResult = execSync('npx lhci autorun --config=.lighthouserc-mobile.js', { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    results.mobile.passed = true;
    console.log('✅ Mobile tests passed!\n');
  } catch (error) {
    results.mobile.passed = false;
    results.mobile.errors.push(error.message);
    console.log('❌ Mobile tests failed:\n', error.message);
  }

  // Test Desktop  
  console.log('🖥️  Testing Desktop Performance...');
  try {
    fs.writeFileSync('.lighthouserc-desktop.js', `module.exports = ${JSON.stringify(DESKTOP_CONFIG, null, 2)};`);
    
    const desktopResult = execSync('npx lhci autorun --config=.lighthouserc-desktop.js', { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    results.desktop.passed = true;
    console.log('✅ Desktop tests passed!\n');
  } catch (error) {
    results.desktop.passed = false;
    results.desktop.errors.push(error.message);
    console.log('❌ Desktop tests failed:\n', error.message);
  }

  // Clean up config files
  try {
    fs.unlinkSync('.lighthouserc-mobile.js');
    fs.unlinkSync('.lighthouserc-desktop.js');
  } catch (e) {
    // Ignore cleanup errors
  }

  // Generate summary report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results,
    summary: {
      mobile: results.mobile.passed ? '✅ PASSED' : '❌ FAILED',
      desktop: results.desktop.passed ? '✅ PASSED' : '❌ FAILED',
      overall: results.mobile.passed && results.desktop.passed ? '✅ ALL PASSED' : '❌ SOME FAILED'
    }
  };

  fs.writeFileSync('lighthouse-ci-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n📊 LIGHTHOUSE CI SUMMARY');
  console.log('========================');
  console.log(`Mobile Performance:  ${report.summary.mobile}`);
  console.log(`Desktop Performance: ${report.summary.desktop}`);
  console.log(`Overall Status:      ${report.summary.overall}`);
  console.log('\nDetailed report saved to: lighthouse-ci-report.json\n');

  // Exit with error code if any tests failed
  if (!results.mobile.passed || !results.desktop.passed) {
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runLighthouseTests().catch(error => {
    console.error('Failed to run Lighthouse CI tests:', error);
    process.exit(1);
  });
}

module.exports = { runLighthouseTests };
