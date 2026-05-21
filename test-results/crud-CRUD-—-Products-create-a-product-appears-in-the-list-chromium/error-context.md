# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crud.spec.ts >> CRUD — Products >> create a product appears in the list
- Location: e2e\crud.spec.ts:64:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div.fixed.z-50').last().locator('input[type="text"]').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
      - generic [ref=e84]:
        - paragraph [ref=e85]: Crud Tester
        - paragraph [ref=e86]: crud_1779397023056@example.com
      - link "Profile" [ref=e87] [cursor=pointer]:
        - /url: /profile
        - img [ref=e88]
        - text: Profile
      - link "Settings" [ref=e90] [cursor=pointer]:
        - /url: /settings
        - img [ref=e91]
        - text: Settings
      - link "Sign out" [ref=e95] [cursor=pointer]:
        - /url: /api/auth/signout
        - img [ref=e96]
        - text: Sign out
  - main [ref=e98]:
    - generic [ref=e99]:
      - generic [ref=e100]:
        - generic [ref=e101]:
          - heading "Absolute modal examples" [level=2] [ref=e102]
          - generic [ref=e103]:
            - button "Open below" [ref=e104]
            - button "Open dropdown menu" [ref=e105]
            - button "Open right-aligned" [ref=e106]
            - button "Pin to screen" [ref=e107]
            - button "Hover me" [ref=e108]
          - paragraph [ref=e109]: Click multiple buttons to stack modals — they don't close each other. Click anywhere outside the triggers and modals to close them all. The green button uses hover.
        - generic [ref=e110]:
          - heading "New Image" [level=2] [ref=e111]
          - button "Choose File" [ref=e113]
        - generic [ref=e114]:
          - heading "Uploaded Images" [level=2] [ref=e115]
          - generic [ref=e116]:
            - generic [ref=e117]:
              - generic [ref=e119]:
                - img "Image 2" [ref=e120]
                - button "Edit image style" [ref=e121]:
                  - img [ref=e122]
              - generic [ref=e124]: No alt text
            - generic [ref=e125]:
              - generic [ref=e127]:
                - img "Image 1" [ref=e128]
                - button "Edit image style" [ref=e129]:
                  - img [ref=e130]
              - generic [ref=e132]: No alt text
        - generic [ref=e133]:
          - heading "New Product" [level=2] [ref=e134]
          - button "Create" [ref=e135]
        - generic [ref=e136]:
          - generic [ref=e137]:
            - heading "Products" [level=2] [ref=e138]
            - generic [ref=e139]:
              - text: "[loaded] read on"
              - strong [ref=e140]: product
              - text: — 926ms
          - generic [ref=e141]:
            - button "Gadget Edit 8 Edit Delete" [ref=e142]:
              - generic [ref=e143]:
                - generic [ref=e144]:
                  - generic [ref=e145]: Gadget
                  - button "Edit" [ref=e146]
                - generic [ref=e147]:
                  - generic [ref=e148]: "8"
                  - button "Edit" [ref=e149]
                - button "Delete" [ref=e150]
            - button "Doohickey Edit 5 Edit Delete" [ref=e151]:
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - generic [ref=e154]: Doohickey
                  - button "Edit" [ref=e155]
                - generic [ref=e156]:
                  - generic [ref=e157]: "5"
                  - button "Edit" [ref=e158]
                - button "Delete" [ref=e159]
            - button "Unauthorized Product Edit 1 Edit Delete" [ref=e160]:
              - generic [ref=e161]:
                - generic [ref=e162]:
                  - generic [ref=e163]: Unauthorized Product
                  - button "Edit" [ref=e164]
                - generic [ref=e165]:
                  - generic [ref=e166]: "1"
                  - button "Edit" [ref=e167]
                - button "Delete" [ref=e168]
      - generic [ref=e169]:
        - generic [ref=e170]:
          - heading "New Product Child" [level=2] [ref=e171]
          - button "Create" [ref=e172]
        - generic [ref=e174]:
          - heading "Product Children" [level=2] [ref=e175]
          - generic [ref=e176]:
            - text: "[loaded] read on"
            - strong [ref=e177]: productChild
            - text: — 1727ms
      - generic [ref=e178]:
        - generic [ref=e179]:
          - heading "New Many One" [level=2] [ref=e180]
          - button "Create" [ref=e181]
        - generic [ref=e183]:
          - heading "Many Ones" [level=2] [ref=e184]
          - generic [ref=e185]:
            - text: "[loaded] read on"
            - strong [ref=e186]: manyOne
            - text: — 1674ms
      - generic [ref=e187]:
        - generic [ref=e188]:
          - heading "New Many Two" [level=2] [ref=e189]
          - button "Create" [ref=e190]
        - generic [ref=e192]:
          - heading "Many Twos" [level=2] [ref=e193]
          - generic [ref=e194]:
            - text: "[loaded] read on"
            - strong [ref=e195]: manyTwo
            - text: — 1723ms
  - contentinfo [ref=e196]:
    - generic [ref=e198]:
      - generic [ref=e199]: MyApp
      - generic [ref=e200]:
        - link "Home" [ref=e201] [cursor=pointer]:
          - /url: /
        - link "About" [ref=e202] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e203] [cursor=pointer]:
          - /url: /privacy
        - link "Terms" [ref=e204] [cursor=pointer]:
          - /url: /terms
      - paragraph [ref=e205]: © 2026 MyApp. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e211] [cursor=pointer]:
    - img [ref=e212]
  - alert [ref=e215]
  - generic [ref=e217]:
    - generic [ref=e218]:
      - heading "New product" [level=2] [ref=e219]
      - button "×" [ref=e220]
    - generic [ref=e222]:
      - generic [ref=e223]:
        - generic [ref=e224]: Price (€)*
        - spinbutton [ref=e227]: "0"
      - generic [ref=e228]:
        - generic [ref=e229]: Product Name*
        - combobox [active] [ref=e232]:
          - option "Widget" [selected]
          - option "Gadget"
          - option "Doohickey"
          - option "Thingamajig"
      - generic [ref=e234]:
        - paragraph [ref=e235]: Child Product
        - button "+ Add Child Product" [ref=e236]
      - button "Create" [ref=e238]
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
  31  |   // Use the heading's immediate parent — the section wrapper that holds just
  32  |   // this heading + its DataForm Create button.
  33  |   const section = page.locator(`h2:text-is("${sectionHeading}")`).locator('..');
  34  |   await section.getByRole('button', { name: 'Create' }).click();
  35  |   // Modal opens with title "New <table>"
  36  |   await expect(page.locator('h2', { hasText: /^New /i }).last()).toBeVisible();
  37  | }
  38  | 
  39  | async function submitCreateModal(page: Page) {
  40  |   // The modal renders its own "Create" submit button at the bottom.
  41  |   // After the modal opens, there are multiple Create buttons; the modal's is the last in DOM.
  42  |   await page.getByRole('button', { name: 'Create' }).last().click();
  43  | }
  44  | 
  45  | test.describe('CRUD — Products', () => {
  46  |   test.describe.configure({ mode: 'serial' });
  47  | 
  48  |   test.beforeAll(async ({ browser }) => {
  49  |     const page = await browser.newPage();
  50  |     try {
  51  |       await signUp(page);
  52  |     } catch (err) {
  53  |       console.log('Signup may have failed (user might already exist):', err);
  54  |     }
  55  |     await page.close();
  56  |   });
  57  | 
  58  |   test('dashboard loads with Products section', async ({ page }) => {
  59  |     await signIn(page);
  60  |     await expect(page.locator('h2:text-is("Products")')).toBeVisible();
  61  |     await expect(page.locator('h2:text-is("New Product")')).toBeVisible();
  62  |   });
  63  | 
  64  |   test('create a product appears in the list', async ({ page }) => {
  65  |     await signIn(page);
  66  | 
  67  |     const productName = `Test Product ${Date.now()}`;
  68  | 
  69  |     await openCreateModal(page, 'New Product');
  70  | 
  71  |     // Inside the modal: first text input is "name", first number input is "price".
  72  |     const modal = page.locator('div.fixed.z-50').last();
> 73  |     await modal.locator('input[type="text"]').first().fill(productName);
      |                                                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  74  |     await modal.locator('input[type="number"]').first().fill('19.99');
  75  | 
  76  |     await submitCreateModal(page);
  77  | 
  78  |     await expect(page.locator(`text=${productName}`)).toBeVisible({ timeout: 10000 });
  79  |   });
  80  | 
  81  |   test('edit a product name inline', async ({ page }) => {
  82  |     await signIn(page);
  83  | 
  84  |     const original = `Edit Me ${Date.now()}`;
  85  |     const renamed = `Renamed ${Date.now()}`;
  86  | 
  87  |     // Create one first
  88  |     await openCreateModal(page, 'New Product');
  89  |     const modal = page.locator('div.fixed.z-50').last();
  90  |     await modal.locator('input[type="text"]').first().fill(original);
  91  |     await modal.locator('input[type="number"]').first().fill('1.00');
  92  |     await submitCreateModal(page);
  93  |     await expect(page.locator(`text=${original}`)).toBeVisible();
  94  | 
  95  |     // Find the product row containing that text and click its Edit
  96  |     const row = page.locator('div.bg-white', { hasText: original }).first();
  97  |     await row.getByRole('button', { name: 'Edit' }).first().click();
  98  | 
  99  |     // Replace the value in the now-visible input
  100 |     const input = row.locator('input[type="text"]').first();
  101 |     await input.fill(renamed);
  102 |     await row.getByRole('button', { name: 'Save' }).click();
  103 | 
  104 |     await expect(page.locator(`text=${renamed}`)).toBeVisible({ timeout: 10000 });
  105 |   });
  106 | 
  107 |   test('delete a product removes it from the list', async ({ page }) => {
  108 |     await signIn(page);
  109 | 
  110 |     const name = `Delete Me ${Date.now()}`;
  111 | 
  112 |     await openCreateModal(page, 'New Product');
  113 |     const modal = page.locator('div.fixed.z-50').last();
  114 |     await modal.locator('input[type="text"]').first().fill(name);
  115 |     await modal.locator('input[type="number"]').first().fill('1.00');
  116 |     await submitCreateModal(page);
  117 |     await expect(page.locator(`text=${name}`)).toBeVisible();
  118 | 
  119 |     const row = page.locator('div.bg-white', { hasText: name }).first();
  120 |     await row.getByRole('button', { name: 'Delete' }).click();
  121 | 
  122 |     await expect(page.locator(`text=${name}`)).not.toBeVisible({ timeout: 10000 });
  123 |   });
  124 | 
  125 | });
  126 | 
```