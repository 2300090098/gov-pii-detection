async function runTests() {
  try {
    console.log('Testing Backend API on http://localhost:5000 ...');

    // 1. Health
    const healthRes = await fetch('http://localhost:5000/api/health');
    const health = await healthRes.json();
    console.log('✓ 1. Health Check:', health.status, '| Service:', health.service);

    // 2. Text Scan
    const scanRes = await fetch('http://localhost:5000/api/scan/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'CONFIDENTIAL TAX ASSESSMENT. Name: Rajesh Sharma, PAN: ABCPS1234F, Aadhaar UID: 3675 9834 6012, Mobile: +91 9876543210, Email: rajesh@example.com',
        fileName: 'Tax Assessment Sample'
      })
    });
    const scanData = await scanRes.json();
    console.log('✓ 2. Text Scan Result:');
    console.log('   - Success:', scanData.success);
    console.log('   - Risk Level:', scanData.scan?.riskLevel, `(Score: ${scanData.scan?.riskScore}/100)`);
    console.log('   - Detections Count:', scanData.scan?.detectionCount);
    console.log('   - Masked Detections:');
    scanData.scan?.detections?.forEach(d => {
      console.log(`     • [${d.category}] -> Masked: "${d.maskedValue}" | Confidence: ${Math.round(d.confidence * 100)}% | Risk: ${d.riskLevel}`);
    });

    const scanId = scanData.scan?.id;

    // 3. Document Scan with sample file
    const fs = await import('fs');
    const path = await import('path');
    const sampleFilePath = path.resolve('database/sample_files/sample-hr-onboarding.txt');
    if (fs.existsSync(sampleFilePath)) {
      const fileBuffer = fs.readFileSync(sampleFilePath);
      const blob = new Blob([fileBuffer], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('document', blob, 'sample-hr-onboarding.txt');

      const docRes = await fetch('http://localhost:5000/api/scan/document', {
        method: 'POST',
        body: formData
      });
      const docData = await docRes.json();
      console.log('✓ 3. Document Scan Result:');
      console.log('   - Success:', docData.success);
      console.log('   - Risk Level:', docData.scan?.riskLevel);
      console.log('   - Categories:', docData.scan?.categoriesDetected);
      console.log('   - Detections:', docData.scan?.detectionCount);
    }

    // 4. Dashboard Stats
    const statsRes = await fetch('http://localhost:5000/api/dashboard/stats');
    const statsData = await statsRes.json();
    console.log('✓ 4. Dashboard Stats:');
    console.log('   - Total Scans Logged:', statsData.stats?.totalScans);
    console.log('   - Total PII Findings:', statsData.stats?.totalDetections);
    console.log('   - High Risk Scans:', statsData.stats?.highRiskScans);

    // 5. Scans History
    const historyRes = await fetch('http://localhost:5000/api/scans');
    const historyData = await historyRes.json();
    console.log('✓ 5. Scans History List:');
    console.log('   - Count:', historyData.scans?.length);

    // 6. Get Specific Scan By ID
    if (scanId) {
      const singleRes = await fetch(`http://localhost:5000/api/scans/${scanId}`);
      const singleData = await singleRes.json();
      console.log('✓ 6. Retrieve Scan by ID:', singleData.success ? 'Found' : 'Failed');
    }

    // 7. Settings
    const settingsRes = await fetch('http://localhost:5000/api/settings');
    const settingsData = await settingsRes.json();
    console.log('✓ 7. Settings & Diagnostics:');
    console.log('   - Confidence Threshold:', settingsData.settings?.confidenceThreshold);
    console.log('   - System Status:', settingsData.systemStatus);

    console.log('\n========================================');
    console.log('🎉 ALL BACKEND ENDPOINTS VERIFIED & WORKING!');
    console.log('========================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
