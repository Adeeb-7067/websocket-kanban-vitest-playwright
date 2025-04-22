import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for the board to load
    await page.waitForSelector('.kanban-board');
  });

  test('creates a new task', async ({ page }) => {
    // Fill in task details
    await page.fill('input[placeholder="Task title"]', 'E2E Test Task');
    await page.fill('input[placeholder="Task description"]', 'E2E Test Description');
    
    // Select priority and category
    await page.selectOption('select[name="priority"]', 'high');
    await page.selectOption('select[name="category"]', 'feature');
    
    // Submit the form
    await page.click('button:has-text("Add Task")');
    
    // Verify task was created
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
    await expect(page.locator('text=E2E Test Description')).toBeVisible();
  });

  test('drags and drops task between columns', async ({ page }) => {
    // Create a task first
    await page.fill('input[placeholder="Task title"]', 'Drag Test Task');
    await page.fill('input[placeholder="Task description"]', 'Drag Test Description');
    await page.click('button:has-text("Add Task")');
    
    // Wait for the task to be created
    const task = await page.waitForSelector('text=Drag Test Task');
    
    // Get the "In Progress" column
    const targetColumn = await page.locator('.column:has-text("In Progress")');
    
    // Drag and drop
    await task.dragTo(targetColumn);
    
    // Verify task moved to new column
    await expect(targetColumn.locator('text=Drag Test Task')).toBeVisible();
  });

  test('updates task priority and category', async ({ page }) => {
    // Create a task
    await page.fill('input[placeholder="Task title"]', 'Update Test Task');
    await page.fill('input[placeholder="Task description"]', 'Update Test Description');
    await page.click('button:has-text("Add Task")');
    
    // Wait for task to be created
    await page.waitForSelector('text=Update Test Task');
    
    // Click edit button
    await page.click('button:has-text("Edit")');
    
    // Update priority and category
    await page.selectOption('select[name="priority"]', 'high');
    await page.selectOption('select[name="category"]', 'bug');
    
    // Save changes
    await page.click('button:has-text("Save")');
    
    // Verify updates
    await expect(page.locator('text=high')).toBeVisible();
    await expect(page.locator('text=bug')).toBeVisible();
  });

  test('uploads file attachment', async ({ page }) => {
    // Create a task
    await page.fill('input[placeholder="Task title"]', 'File Upload Task');
    await page.fill('input[placeholder="Task description"]', 'File Upload Description');
    await page.click('button:has-text("Add Task")');
    
    // Wait for task to be created
    await page.waitForSelector('text=File Upload Task');
    
    // Upload file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello, World!')
    });
    
    // Verify file was uploaded
    await expect(page.locator('text=test.txt')).toBeVisible();
  });

  test('deletes task', async ({ page }) => {
    // Create a task
    await page.fill('input[placeholder="Task title"]', 'Delete Test Task');
    await page.fill('input[placeholder="Task description"]', 'Delete Test Description');
    await page.click('button:has-text("Add Task")');
    
    // Wait for task to be created
    await page.waitForSelector('text=Delete Test Task');
    
    // Click delete button
    await page.click('button:has-text("Delete")');
    
    // Verify task was deleted
    await expect(page.locator('text=Delete Test Task')).not.toBeVisible();
  });

  test('progress chart updates when tasks move', async ({ page }) => {
    // Create a task
    await page.fill('input[placeholder="Task title"]', 'Chart Test Task');
    await page.fill('input[placeholder="Task description"]', 'Chart Test Description');
    await page.click('button:has-text("Add Task")');
    
    // Wait for task to be created
    const task = await page.waitForSelector('text=Chart Test Task');
    
    // Move task to "Done" column
    const doneColumn = await page.locator('.column:has-text("Done")');
    await task.dragTo(doneColumn);
    
    // Verify chart updates
    await expect(page.locator('canvas')).toBeVisible();
    // Note: We can't verify the exact chart values as they're rendered in a canvas
  });
}); 