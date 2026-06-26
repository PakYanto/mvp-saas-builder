#!/usr/bin/env tsx
/**
 * Comprehensive API Test Script
 * Tests all 10 endpoints with validation and error handling
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  data?: any;
  error?: string;
}

const results: TestResult[] = [];

function logTest(endpoint: string, method: string, status: number, success: boolean, data?: any, error?: string) {
  results.push({ endpoint, method, status, success, data, error });
  const icon = success ? '✓' : '✗';
  console.log(`${icon} ${method} ${endpoint} - Status ${status}`);
  if (error) console.log(`  Error: ${error}`);
}

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  let testUserId = 'test-user-' + Date.now();
  let testProjectId: string;
  let testProductId: string = '';
  let testTemplateId: string;
  let testSlug: string;

  try {
    // 1. GET /api/templates
    console.log('\n📋 Test 1: GET /api/templates');
    const templatesRes = await fetch(`${BASE_URL}/api/templates`);
    const templatesData = await templatesRes.json();
    logTest('/api/templates', 'GET', templatesRes.status, templatesRes.ok, templatesData);
    
    if (templatesRes.ok && templatesData.templates?.length > 0) {
      testTemplateId = templatesData.templates[0].id;
      console.log(`  Using template: ${templatesData.templates[0].name} (${testTemplateId})`);
    } else {
      throw new Error('No templates found - cannot continue tests');
    }

    // 2. POST /api/projects - Create project
    console.log('\n📋 Test 2: POST /api/projects');
    const projectPayload = {
      userId: testUserId,
      templateId: testTemplateId,
      storeName: 'Test Coffee Shop',
      tagline: 'The best coffee in town',
      category: 'food-beverage',
      themeColor: '#8B4513',
    };
    const createProjectRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectPayload),
    });
    const projectData = await createProjectRes.json();
    logTest('/api/projects', 'POST', createProjectRes.status, createProjectRes.ok, projectData);
    
    if (createProjectRes.ok) {
      testProjectId = projectData.id;
      testSlug = projectData.slug;
      console.log(`  Created project: ${testProjectId}`);
      console.log(`  Generated slug: ${testSlug}`);
    } else {
      throw new Error('Failed to create project');
    }

    // 3. GET /api/projects (list with filters)
    console.log('\n📋 Test 3: GET /api/projects?userId=...');
    const listProjectsRes = await fetch(`${BASE_URL}/api/projects?userId=${testUserId}&limit=5`);
    const listProjectsData = await listProjectsRes.json();
    logTest('/api/projects?userId=...', 'GET', listProjectsRes.status, listProjectsRes.ok, listProjectsData);
    
    if (listProjectsRes.ok) {
      console.log(`  Found ${listProjectsData.projects?.length || 0} projects`);
      console.log(`  Total: ${listProjectsData.pagination?.total || 0}`);
    }

    // 4. GET /api/projects/[id]
    console.log('\n📋 Test 4: GET /api/projects/[id]');
    const getProjectRes = await fetch(`${BASE_URL}/api/projects/${testProjectId}`);
    const getProjectData = await getProjectRes.json();
    logTest(`/api/projects/${testProjectId}`, 'GET', getProjectRes.status, getProjectRes.ok, getProjectData);

    // 5. PATCH /api/projects/[id]
    console.log('\n📋 Test 5: PATCH /api/projects/[id]');
    const updatePayload = {
      tagline: 'Updated: Premium coffee experience',
      status: 'published',
    };
    const updateProjectRes = await fetch(`${BASE_URL}/api/projects/${testProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    const updateProjectData = await updateProjectRes.json();
    logTest(`/api/projects/${testProjectId}`, 'PATCH', updateProjectRes.status, updateProjectRes.ok, updateProjectData);

    // 6. POST /api/products - Add product
    console.log('\n📋 Test 6: POST /api/products');
    const productPayload = {
      projectId: testProjectId,
      name: 'Cappuccino',
      price: 35000,
      description: 'Rich and creamy cappuccino',
      sortOrder: 1,
    };
    const createProductRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload),
    });
    const productData = await createProductRes.json();
    logTest('/api/products', 'POST', createProductRes.status, createProductRes.ok, productData);
    
    if (createProductRes.ok) {
      testProductId = productData.id;
      console.log(`  Created product: ${testProductId}`);
    }

    // 7. POST /api/products - Add another product
    console.log('\n📋 Test 7: POST /api/products (2nd product)');
    const product2Payload = {
      projectId: testProjectId,
      name: 'Espresso',
      price: 25000,
      description: 'Strong Italian espresso',
      sortOrder: 2,
    };
    const createProduct2Res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product2Payload),
    });
    const product2Data = await createProduct2Res.json();
    logTest('/api/products', 'POST', createProduct2Res.status, createProduct2Res.ok, product2Data);

    // 8. GET /api/preview/[slug]
    console.log('\n📋 Test 8: GET /api/preview/[slug]');
    const previewRes = await fetch(`${BASE_URL}/api/preview/${testSlug}`);
    const previewData = await previewRes.json();
    logTest(`/api/preview/${testSlug}`, 'GET', previewRes.status, previewRes.ok, previewData);
    
    if (previewRes.ok) {
      console.log(`  Project: ${previewData.storeName}`);
      console.log(`  Products: ${previewData.products?.length || 0}`);
    }

    // 9. POST /api/leads - Submit lead
    console.log('\n📋 Test 9: POST /api/leads');
    const leadPayload = {
      projectId: testProjectId,
      userId: testUserId,
      name: 'John Doe',
      phone: '+628123456789',
      email: 'john@example.com',
      message: 'Interested in your products!',
    };
    const createLeadRes = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload),
    });
    const leadData = await createLeadRes.json();
    logTest('/api/leads', 'POST', createLeadRes.status, createLeadRes.ok, leadData);

    // 10. DELETE /api/products/[id]
    console.log('\n📋 Test 10: DELETE /api/products/[id]');
    const deleteProductRes = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
      method: 'DELETE',
    });
    const deleteProductData = await deleteProductRes.json();
    logTest(`/api/products/${testProductId}`, 'DELETE', deleteProductRes.status, deleteProductRes.ok, deleteProductData);

    // VALIDATION TESTS
    console.log('\n🔍 Validation Tests:');

    // Test 11: Invalid project creation (missing required field)
    console.log('\n📋 Test 11: POST /api/projects (invalid - missing storeName)');
    const invalidProjectRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId, templateId: testTemplateId }),
    });
    const invalidProjectData = await invalidProjectRes.json();
    logTest('/api/projects (invalid)', 'POST', invalidProjectRes.status, invalidProjectRes.status === 400, invalidProjectData);

    // Test 12: Invalid product (negative price)
    console.log('\n📋 Test 12: POST /api/products (invalid - negative price)');
    const invalidProductRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: testProjectId, name: 'Test', price: -100 }),
    });
    const invalidProductData = await invalidProductRes.json();
    logTest('/api/products (invalid)', 'POST', invalidProductRes.status, invalidProductRes.status === 400, invalidProductData);

    // Test 13: 404 - Get non-existent project
    console.log('\n📋 Test 13: GET /api/projects/[id] (non-existent)');
    const notFoundRes = await fetch(`${BASE_URL}/api/projects/non-existent-id`);
    const notFoundData = await notFoundRes.json();
    logTest('/api/projects/non-existent-id', 'GET', notFoundRes.status, notFoundRes.status === 404, notFoundData);

    // Test 14: Slug collision handling
    console.log('\n📋 Test 14: POST /api/projects (test slug collision)');
    const duplicateProjectRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        templateId: testTemplateId,
        storeName: 'Test Coffee Shop', // Same name, should get different slug
        category: 'food-beverage',
        themeColor: '#3B82F6',
      }),
    });
    const duplicateProjectData = await duplicateProjectRes.json();
    logTest('/api/projects (duplicate name)', 'POST', duplicateProjectRes.status, duplicateProjectRes.ok, duplicateProjectData);
    
    if (duplicateProjectRes.ok) {
      console.log(`  Original slug: ${testSlug}`);
      console.log(`  New slug: ${duplicateProjectData.slug}`);
      console.log(`  Collision handled: ${testSlug !== duplicateProjectData.slug ? '✓' : '✗'}`);
    }

  } catch (error: any) {
    console.error('\n❌ Test suite error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total tests: ${results.length}`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Success rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  console.log('\n' + '='.repeat(60));
  
  if (failed > 0) {
    console.log('\n❌ Failed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ${r.method} ${r.endpoint} - Status ${r.status}`);
      if (r.error) console.log(`    ${r.error}`);
    });
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
testAPI().catch(console.error);
