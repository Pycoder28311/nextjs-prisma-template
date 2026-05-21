# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crud.spec.ts >> CRUD — Products >> create a product appears in the list
- Location: e2e\crud.spec.ts:62:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('div').filter({ has: locator('h2:text-is("New Product")') }).first().getByRole('button', { name: 'Create' }) resolved to 4 elements:
    1) <button class="text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700">Create</button> aka getByRole('button', { name: 'Create' }).first()
    2) <button class="text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700">Create</button> aka getByRole('button', { name: 'Create' }).nth(1)
    3) <button class="text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700">Create</button> aka getByRole('button', { name: 'Create' }).nth(2)
    4) <button class="text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700">Create</button> aka getByRole('button', { name: 'Create' }).nth(3)

Call log:
  - waiting for locator('div').filter({ has: locator('h2:text-is("New Product")') }).first().getByRole('button', { name: 'Create' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - button "Toggle menu" [ref=e6]
        - link "MyApp" [ref=e11] [cursor=pointer]:
          - /url: /
      - generic [ref=e12]:
        - button "Home" [ref=e13]:
          - link "Home" [ref=e14] [cursor=pointer]:
            - /url: /
        - button "About" [ref=e15]:
          - link "About" [ref=e16] [cursor=pointer]:
            - /url: /about
            - text: About
            - img [ref=e17]
        - button "Products" [ref=e19]:
          - link "Products" [ref=e20] [cursor=pointer]:
            - /url: /products
            - text: Products
            - img [ref=e21]
        - button "Pricing" [ref=e23]:
          - link "Pricing" [ref=e24] [cursor=pointer]:
            - /url: /pricing
        - button "Blog" [ref=e25]:
          - link "Blog" [ref=e26] [cursor=pointer]:
            - /url: /blog
        - button "Docs" [ref=e27]:
          - link "Docs" [ref=e28] [cursor=pointer]:
            - /url: /docs
        - button "Contact" [ref=e29]:
          - link "Contact" [ref=e30] [cursor=pointer]:
            - /url: /contact
      - generic [ref=e31]:
        - button "Change theme" [ref=e33]:
          - img [ref=e34]
        - button "Search" [ref=e37]:
          - img [ref=e38]
        - button "User menu" [ref=e41]:
          - img [ref=e42]
  - generic [ref=e44]:
    - generic [ref=e45]:
      - heading "Sidebar" [level=2] [ref=e46]
      - button "Close sidebar" [ref=e47]:
        - img [ref=e48]
    - navigation [ref=e51]:
      - link "Dashboard" [ref=e52] [cursor=pointer]:
        - /url: /
        - img [ref=e53]
        - text: Dashboard
      - link "Projects" [ref=e55] [cursor=pointer]:
        - /url: /projects
        - img [ref=e56]
        - text: Projects
      - link "Tasks" [ref=e58] [cursor=pointer]:
        - /url: /tasks
        - img [ref=e59]
        - text: Tasks
      - link "Messages" [ref=e61] [cursor=pointer]:
        - /url: /messages
        - img [ref=e62]
        - text: Messages
      - link "Analytics" [ref=e64] [cursor=pointer]:
        - /url: /analytics
        - img [ref=e65]
        - text: Analytics
      - generic [ref=e67]:
        - paragraph [ref=e68]: Account
        - link "Settings" [ref=e69] [cursor=pointer]:
          - /url: /settings
          - img [ref=e70]
          - text: Settings
        - link "Help & Support" [ref=e73] [cursor=pointer]:
          - /url: /help
          - img [ref=e74]
          - text: Help & Support
  - generic [ref=e76]:
    - generic [ref=e77]:
      - heading "Account" [level=2] [ref=e78]
      - button "Close sidebar" [ref=e79]:
        - img [ref=e80]
    - generic [ref=e83]:
      - link "Sign in" [ref=e84] [cursor=pointer]:
        - /url: /login
      - link "Register" [ref=e85] [cursor=pointer]:
        - /url: /register
  - main [ref=e86]:
    - generic [ref=e87]:
      - generic [ref=e88]:
        - generic [ref=e89]:
          - heading "Absolute modal examples" [level=2] [ref=e90]
          - generic [ref=e91]:
            - button "Open below" [ref=e92]
            - button "Open dropdown menu" [ref=e93]
            - button "Open right-aligned" [ref=e94]
            - button "Hover me" [ref=e95]
          - paragraph [ref=e96]: Click multiple buttons to stack modals — they don't close each other. Click anywhere outside the triggers and modals to close them all. The green button uses hover.
        - generic [ref=e97]:
          - heading "New Product" [level=2] [ref=e98]
          - button "Create" [ref=e99]
        - generic [ref=e101]:
          - heading "Products" [level=2] [ref=e102]
          - generic [ref=e103]:
            - text: "[loading] read on"
            - strong [ref=e104]: product
      - generic [ref=e105]:
        - generic [ref=e106]:
          - heading "New Product Child" [level=2] [ref=e107]
          - button "Create" [ref=e108]
        - generic [ref=e110]:
          - heading "Product Children" [level=2] [ref=e111]
          - generic [ref=e112]:
            - text: "[loading] read on"
            - strong [ref=e113]: productChild
      - generic [ref=e114]:
        - generic [ref=e115]:
          - heading "New Many One" [level=2] [ref=e116]
          - button "Create" [ref=e117]
        - generic [ref=e119]:
          - heading "Many Ones" [level=2] [ref=e120]
          - generic [ref=e121]:
            - text: "[loading] read on"
            - strong [ref=e122]: manyOne
      - generic [ref=e123]:
        - generic [ref=e124]:
          - heading "New Many Two" [level=2] [ref=e125]
          - button "Create" [ref=e126]
        - generic [ref=e128]:
          - heading "Many Twos" [level=2] [ref=e129]
          - generic [ref=e130]:
            - text: "[loading] read on"
            - strong [ref=e131]: manyTwo
  - contentinfo [ref=e132]:
    - generic [ref=e134]:
      - generic [ref=e135]: MyApp
      - generic [ref=e136]:
        - link "Home" [ref=e137] [cursor=pointer]:
          - /url: /
        - link "About" [ref=e138] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e139] [cursor=pointer]:
          - /url: /privacy
        - link "Terms" [ref=e140] [cursor=pointer]:
          - /url: /terms
      - paragraph [ref=e141]: © 2026 MyApp. All rights reserved.
  - alert [ref=e142]
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const EMAIL = `crud_${Date.now()}@example.com`;
  4   | const PASSWORD = 'TestPass1!';
  5   | const NAME = 'Crud Tester';
  6   | 
  7   | async function signUp(page: Page) {
  8   |   await page.goto('/auth/signup');
  9   |   await page.fill('#email', EMAIL);
  10  |   await page.fill('#password', PASSWORD);
  11  |   await page.fill('#confirmPassword', PASSWORD);
  12  |   await page.fill('#name', NAME);
  13  |   await page.click('button[type="submit"]');
  14  |   await page.waitForURL('/', { timeout: 15000 });
  15  | }
  16  | 
  17  | async function signIn(page: Page) {
  18  |   await page.goto('/auth/signin');
  19  |   await page.fill('input[name="email"]', EMAIL);
  20  |   await page.fill('input[name="password"]', PASSWORD);
  21  |   await page.click('button[type="submit"]');
  22  |   await page.waitForURL('/', { timeout: 15000 });
  23  | }
  24  | 
  25  | // Each section on the dashboard begins with an <h2> heading.
  26  | // "New Product" → DataForm trigger button (opens create modal)
  27  | // "Products"    → list of product cards
  28  | // Use these headings to scope actions to the right section.
  29  | 
  30  | async function openCreateModal(page: Page, sectionHeading: string) {
  31  |   const section = page.locator('div', { has: page.locator(`h2:text-is("${sectionHeading}")`) }).first();
> 32  |   await section.getByRole('button', { name: 'Create' }).click();
      |                                                         ^ Error: locator.click: Error: strict mode violation: locator('div').filter({ has: locator('h2:text-is("New Product")') }).first().getByRole('button', { name: 'Create' }) resolved to 4 elements:
  33  |   // Modal opens with title "New <table>"
  34  |   await expect(page.locator('h2', { hasText: /^New /i }).last()).toBeVisible();
  35  | }
  36  | 
  37  | async function submitCreateModal(page: Page) {
  38  |   // The modal renders its own "Create" submit button at the bottom.
  39  |   // After the modal opens, there are multiple Create buttons; the modal's is the last in DOM.
  40  |   await page.getByRole('button', { name: 'Create' }).last().click();
  41  | }
  42  | 
  43  | test.describe('CRUD — Products', () => {
  44  |   test.describe.configure({ mode: 'serial' });
  45  | 
  46  |   test.beforeAll(async ({ browser }) => {
  47  |     const page = await browser.newPage();
  48  |     try {
  49  |       await signUp(page);
  50  |     } catch (err) {
  51  |       console.log('Signup may have failed (user might already exist):', err);
  52  |     }
  53  |     await page.close();
  54  |   });
  55  | 
  56  |   test('dashboard loads with Products section', async ({ page }) => {
  57  |     await signIn(page);
  58  |     await expect(page.locator('h2:text-is("Products")')).toBeVisible();
  59  |     await expect(page.locator('h2:text-is("New Product")')).toBeVisible();
  60  |   });
  61  | 
  62  |   test('create a product appears in the list', async ({ page }) => {
  63  |     await signIn(page);
  64  | 
  65  |     const productName = `Test Product ${Date.now()}`;
  66  | 
  67  |     await openCreateModal(page, 'New Product');
  68  | 
  69  |     // Inside the modal: first text input is "name", first number input is "price".
  70  |     const modal = page.locator('div.fixed.z-50').last();
  71  |     await modal.locator('input[type="text"]').first().fill(productName);
  72  |     await modal.locator('input[type="number"]').first().fill('19.99');
  73  | 
  74  |     await submitCreateModal(page);
  75  | 
  76  |     await expect(page.locator(`text=${productName}`)).toBeVisible({ timeout: 10000 });
  77  |   });
  78  | 
  79  |   test('edit a product name inline', async ({ page }) => {
  80  |     await signIn(page);
  81  | 
  82  |     const original = `Edit Me ${Date.now()}`;
  83  |     const renamed = `Renamed ${Date.now()}`;
  84  | 
  85  |     // Create one first
  86  |     await openCreateModal(page, 'New Product');
  87  |     const modal = page.locator('div.fixed.z-50').last();
  88  |     await modal.locator('input[type="text"]').first().fill(original);
  89  |     await modal.locator('input[type="number"]').first().fill('1.00');
  90  |     await submitCreateModal(page);
  91  |     await expect(page.locator(`text=${original}`)).toBeVisible();
  92  | 
  93  |     // Find the product row containing that text and click its Edit
  94  |     const row = page.locator('div.bg-white', { hasText: original }).first();
  95  |     await row.getByRole('button', { name: 'Edit' }).first().click();
  96  | 
  97  |     // Replace the value in the now-visible input
  98  |     const input = row.locator('input[type="text"]').first();
  99  |     await input.fill(renamed);
  100 |     await row.getByRole('button', { name: 'Save' }).click();
  101 | 
  102 |     await expect(page.locator(`text=${renamed}`)).toBeVisible({ timeout: 10000 });
  103 |   });
  104 | 
  105 |   test('delete a product removes it from the list', async ({ page }) => {
  106 |     await signIn(page);
  107 | 
  108 |     const name = `Delete Me ${Date.now()}`;
  109 | 
  110 |     await openCreateModal(page, 'New Product');
  111 |     const modal = page.locator('div.fixed.z-50').last();
  112 |     await modal.locator('input[type="text"]').first().fill(name);
  113 |     await modal.locator('input[type="number"]').first().fill('1.00');
  114 |     await submitCreateModal(page);
  115 |     await expect(page.locator(`text=${name}`)).toBeVisible();
  116 | 
  117 |     const row = page.locator('div.bg-white', { hasText: name }).first();
  118 |     await row.getByRole('button', { name: 'Delete' }).click();
  119 | 
  120 |     await expect(page.locator(`text=${name}`)).not.toBeVisible({ timeout: 10000 });
  121 |   });
  122 | 
  123 | });
  124 | 
```